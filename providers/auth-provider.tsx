"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseAuth } from "@/config/firebase";
import { userDoc } from "@/services/data/paths";
import { ClinicianRef, UserProfile } from "@/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  /** The signed-in clinician as recorded on studies. */
  clinician: ClinicianRef | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth(), (next) => {
      setUser(next);
      if (!next) setProfile(null);
      setLoading(false);
    });
  }, []);

  // Live profile: picks up the document written during sign-up.
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      doc(db(), userDoc(user.uid)),
      (snap) => setProfile(snap.exists() ? (snap.data() as UserProfile) : null),
      (err) => console.error("Failed to load clinician profile:", err)
    );
  }, [user]);

  const value = useMemo<AuthContextValue>(() => {
    const name = profile?.displayName || user?.displayName || user?.email || "";
    return {
      user,
      profile,
      clinician: user ? { uid: user.uid, name } : null,
      loading,
    };
  }, [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
