

"use client";

import React, {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  CephStudy,
  ViewMode,
} from "@/types";

import {
  Activity
} from "lucide-react";

import { createEmptyStudy } from "@/utils/helpers";
import { useAuth } from "@/providers/auth-provider";
import { loadStudies, saveStudy, softDeleteStudy } from "@/services/data/studies";
import { importLocalStudies, readLegacyStudies } from "@/services/data/import-local";
import { signOut } from "@/services/auth";
import { RoutePaths } from "@/components/route-paths";
import { PatientList } from "@/components/dashboard/components/patient-list";
import { PatientHistory } from "@/components/dashboard/components/patient-history";
import { AnalysisView } from "@/components/dashboard/components/analysis-view";

export default function App() {
  const router = useRouter();
  const { user, clinician, loading: authLoading } = useAuth();

  const [studies, setStudies] =
    useState<CephStudy[]>([]);

  const [currentStudy, setCurrentStudy] =
    useState<CephStudy | null>(null);

  const [viewMode, setViewMode] =
    useState<ViewMode>("patients");

  const [selectedPatientStudy, setSelectedPatientStudy] =
    useState<CephStudy | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  // Lazy init: localStorage is only read in the browser (server render shows the loader).
  const [legacyCount, setLegacyCount] =
    useState(() => readLegacyStudies().length);

  const [importStatus, setImportStatus] =
    useState<string | null>(null);

  /* =====================================================
     AUTH GUARD
  ===================================================== */

  useEffect(() => {
    if (!authLoading && !user) router.replace(RoutePaths.LOGIN);
  }, [authLoading, user, router]);

  /* =====================================================
     LOAD FROM FIRESTORE
  ===================================================== */

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    loadStudies(user.uid)
      .then((loaded) => {
        if (cancelled) return;
        setStudies(loaded);
        setLoadError(null);
      })
      .catch((err) => {
        console.error("Failed to load studies:", err);
        if (!cancelled) {
          setLoadError("Could not load your patients. Check your connection and reload.");
        }
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  /* =====================================================
     IMPORT STUDIES SAVED IN THIS BROWSER (old version)
  ===================================================== */

  const handleImportLocal = async () => {
    if (!user || !clinician) return;
    setImportStatus("Importing...");
    try {
      const imported = await importLocalStudies(user.uid, clinician, (done, total) =>
        setImportStatus(`Importing ${done} of ${total}...`)
      );
      toast.success(`Imported ${imported.length} analyses from this browser.`);
      setStudies(await loadStudies(user.uid));
    } catch (err) {
      console.error("Import failed:", err);
      toast.error("Import stopped partway. Click import again to continue.");
    } finally {
      setImportStatus(null);
      setLegacyCount(readLegacyStudies().length);
    }
  };

  /*  NEW ANALYSIS */

  // Pass a study to start a new analysis for that study's patient.
  const handleNewAnalysis = (forPatient?: CephStudy) => {
    const newStudy = createEmptyStudy(
      forPatient
        ? { patientId: forPatient.patientId, patient: forPatient.patient }
        : undefined
    );
    setCurrentStudy(newStudy);
    setViewMode("analysis");
    setSelectedPatientStudy(null);
  };

  /* SAVE */

  const handleSaveStudy = async (
    updatedStudy: CephStudy
  ): Promise<CephStudy> => {
    if (!user || !clinician) throw new Error("You are signed out.");

    const previous = studies.find(
      (study) => study.id === updatedStudy.id
    );

    const saved = await saveStudy(user.uid, updatedStudy, previous, clinician);

    setStudies((prev) => {
      // Patient details are shared: refresh them on the patient's other studies.
      const synced = prev.map((study) =>
        study.patientId === saved.patientId
          ? { ...study, patient: { ...saved.patient, date: study.patient.date, doctorName: study.patient.doctorName } }
          : study
      );
      const existingIndex = synced.findIndex((study) => study.id === saved.id);
      if (existingIndex === -1) return [saved, ...synced];
      synced[existingIndex] = saved;
      return synced;
    });

    setCurrentStudy(saved);
    return saved;
  };

  /* =====================================================
     OPEN STUDY
  ===================================================== */

  const handleOpenStudy = (
    study: CephStudy
  ) => {
    setCurrentStudy(study);
    setViewMode("analysis");
  };

   const handleOpenPatienStudy = (
    study: CephStudy
  ) => {
    setCurrentStudy(study);
   
  };

  /* OPEN PATIENT */

  const handleOpenPatient = (
    study: CephStudy
  ) => {
    setSelectedPatientStudy(study);
    setViewMode("patients");
  };

  /* DELETE (soft: kept in history and audit log) */

  const handleDeleteStudy = async () => {
    if (!currentStudy || !user) return;

    const confirmed = window.confirm(
      "Delete this analysis? It will be removed from your patient list. A record is kept in the audit history."
    );

    if (!confirmed) return;

    const saved = studies.find((study) => study.id === currentStudy.id);

    try {
      if (saved) await softDeleteStudy(user.uid, saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete analysis.");
      return;
    }

    setStudies((prev) =>
      prev.filter(
        (study) =>
          study.id !== currentStudy.id
      )
    );

    setCurrentStudy(null);
    setViewMode("patients");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace(RoutePaths.LOGIN);
  };

  const groupedPatients = studies.reduce<
    Record<string, CephStudy[]>
  >((acc, study) => {
    const patientId = study.patientId;

    if (!acc[patientId]) {
      acc[patientId] = [];
    }

    acc[patientId].push(study);

    return acc;
  }, {});

  const patients = Object.values(groupedPatients)
    .map((patientStudies) => {
      const latest = [...patientStudies].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )[0];

      return {
        latest,
        count: patientStudies.length,
      };
    })

  /* LOADING  */

  if (authLoading || !user || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#166534]">
            <Activity className="h-6 w-6 text-white" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading CephVision...
          </p>
        </div>
      </div>
    );
  }

  /* PATIENT HISTORY */

  if (
    viewMode === "patients" &&
    selectedPatientStudy
  ) {
    return (
      <PatientHistory
        study={selectedPatientStudy}
        studies={studies}
        onBack={() =>
          setSelectedPatientStudy(null)
        }
        onOpenStudy={handleOpenStudy}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  /* PATIENT LIST */

  if (
    viewMode === "patients" &&
    !selectedPatientStudy
  ) {
    return (
      <PatientList
        studies={studies}
        allPatient = {patients}
        onNewAnalysis={() => handleNewAnalysis()}
        onOpenPatient={
          handleOpenPatient
        }
        onSignOut={handleSignOut}
        clinicianName={clinician?.name ?? ""}
        loadError={loadError}
        legacyCount={legacyCount}
        importStatus={importStatus}
        onImportLocal={handleImportLocal}
      />
    );
  }

  /* ANALYSIS */

  if (currentStudy) {
    return (
      <AnalysisView
      studies={studies}
      allPatient={patients}
        study={currentStudy}
        onSave={handleSaveStudy}
        onBack={() => {
          setCurrentStudy(null);
          setViewMode("patients");
        }}
        handleOpenStudy ={handleOpenPatienStudy}
        onDelete={handleDeleteStudy}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  return null;
}
