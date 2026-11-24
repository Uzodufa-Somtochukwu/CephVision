// Security rules tests. Run with: npm run test:rules (starts the emulators).
import { after, before, beforeEach, describe, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-cephvision",
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
    storage: { rules: readFileSync("storage.rules", "utf8") },
  });
});

after(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
});

const alice = () => env.authenticatedContext("alice");
const bob = () => env.authenticatedContext("bob");

const study = (version, extra = {}) => ({
  ownerUid: "alice",
  patientId: "p1",
  version,
  deleted: false,
  createdAt: "2026-11-24T00:00:00.000Z",
  updatedAt: "2026-11-24T00:00:00.000Z",
  landmarks: [],
  ...extra,
});

async function seedStudyV1() {
  await env.withSecurityRulesDisabled((ctx) =>
    setDoc(doc(ctx.firestore(), "users/alice/studies/s1"), study(1))
  );
}

describe("firestore", () => {
  test("clinician can create own profile; others cannot read it", async () => {
    const db = alice().firestore();
    await assertSucceeds(
      setDoc(doc(db, "users/alice"), { uid: "alice", displayName: "Dr A", createdAt: "x" })
    );
    await assertFails(getDoc(doc(bob().firestore(), "users/alice")));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "users/alice")));
  });

  test("cannot write into another clinician's space", async () => {
    await assertFails(setDoc(doc(bob().firestore(), "users/alice/studies/s1"), study(1)));
  });

  test("new study must start at version 1", async () => {
    const db = alice().firestore();
    await assertFails(setDoc(doc(db, "users/alice/studies/s1"), study(2)));
    await assertSucceeds(setDoc(doc(db, "users/alice/studies/s1"), study(1)));
  });

  test("update requires a version snapshot in the same batch", async () => {
    await seedStudyV1();
    const db = alice().firestore();

    await assertFails(setDoc(doc(db, "users/alice/studies/s1"), study(2, { clinicianNotes: "x" })));

    const batch = writeBatch(db);
    batch.set(doc(db, "users/alice/studies/s1/versions/1"), {
      ...study(1),
      snapshotAt: serverTimestamp(),
    });
    batch.set(doc(db, "users/alice/studies/s1"), study(2, { clinicianNotes: "x" }));
    await assertSucceeds(batch.commit());
  });

  test("stale writes (version not +1) are rejected", async () => {
    await seedStudyV1();
    const db = alice().firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, "users/alice/studies/s1/versions/1"), {
      ...study(1),
      snapshotAt: serverTimestamp(),
    });
    batch.set(doc(db, "users/alice/studies/s1"), study(3));
    await assertFails(batch.commit());
  });

  test("studies cannot be hard-deleted or moved to another patient", async () => {
    await seedStudyV1();
    const db = alice().firestore();
    await assertFails(deleteDoc(doc(db, "users/alice/studies/s1")));

    const batch = writeBatch(db);
    batch.set(doc(db, "users/alice/studies/s1/versions/1"), {
      ...study(1),
      snapshotAt: serverTimestamp(),
    });
    batch.set(doc(db, "users/alice/studies/s1"), study(2, { patientId: "p2" }));
    await assertFails(batch.commit());
  });

  test("versions, AI runs and audit entries are append-only", async () => {
    const db = alice().firestore();
    const run = doc(db, "users/alice/studies/s1/aiRuns/r1");
    await assertSucceeds(
      setDoc(run, {
        type: "landmark-detection",
        actorUid: "alice",
        output: [],
        createdAt: serverTimestamp(),
      })
    );
    await assertFails(updateDoc(run, { output: ["tampered"] }));
    await assertFails(deleteDoc(run));

    const entry = doc(db, "users/alice/auditLog/a1");
    await assertSucceeds(
      setDoc(entry, { action: "study.created", actorUid: "alice", at: serverTimestamp() })
    );
    await assertFails(deleteDoc(entry));
  });

  test("audit entries must use server time", async () => {
    const db = alice().firestore();
    await assertFails(
      setDoc(doc(db, "users/alice/auditLog/a2"), {
        action: "study.created",
        actorUid: "alice",
        at: new Date("2020-01-01"),
      })
    );
  });
});

describe("storage", () => {
  const base = "users/alice/patients/p1/studies/s1";
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff]);

  test("owner can upload and read a radiograph; others cannot read it", async () => {
    const s = alice().storage();
    await assertSucceeds(
      uploadBytes(ref(s, `${base}/radiograph/u1.jpg`), jpeg, { contentType: "image/jpeg" })
    );
    await assertSucceeds(getBytes(ref(s, `${base}/radiograph/u1.jpg`)));
    await assertFails(getBytes(ref(bob().storage(), `${base}/radiograph/u1.jpg`)));
  });

  test("radiographs cannot be overwritten", async () => {
    const s = alice().storage();
    await uploadBytes(ref(s, `${base}/radiograph/u2.jpg`), jpeg, { contentType: "image/jpeg" });
    await assertFails(
      uploadBytes(ref(s, `${base}/radiograph/u2.jpg`), jpeg, { contentType: "image/jpeg" })
    );
  });

  test("wrong file types are rejected", async () => {
    const s = alice().storage();
    await assertFails(
      uploadBytes(ref(s, `${base}/radiograph/u3.pdf`), jpeg, { contentType: "application/pdf" })
    );
    await assertSucceeds(
      uploadBytes(ref(s, `${base}/reports/r1.pdf`), jpeg, { contentType: "application/pdf" })
    );
    await assertFails(
      uploadBytes(ref(s, `${base}/reports/r2.pdf`), jpeg, { contentType: "image/jpeg" })
    );
  });

  test("other clinicians cannot upload into alice's folder", async () => {
    await assertFails(
      uploadBytes(ref(bob().storage(), `${base}/radiograph/u4.jpg`), jpeg, {
        contentType: "image/jpeg",
      })
    );
  });
});
