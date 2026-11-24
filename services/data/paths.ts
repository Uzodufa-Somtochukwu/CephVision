/**
 * Single source of truth for Firestore and Cloud Storage locations.
 * Keep in sync with firestore.rules and storage.rules.
 *
 * Firestore
 *   users/{uid}                                   clinician profile
 *   users/{uid}/patients/{patientId}              patient details
 *   users/{uid}/studies/{studyId}                 current state of an analysis
 *   users/{uid}/studies/{studyId}/versions/{n}    snapshot before save n+1 (immutable)
 *   users/{uid}/studies/{studyId}/aiRuns/{id}     raw AI output (immutable)
 *   users/{uid}/studies/{studyId}/reports/{id}    generated PDF metadata (immutable)
 *   users/{uid}/auditLog/{id}                     append-only activity log
 *
 * Storage (IDs only, never names: paths appear in logs)
 *   users/{uid}/patients/{patientId}/studies/{studyId}/radiograph/{uploadId}.{ext}
 *   users/{uid}/patients/{patientId}/studies/{studyId}/reports/{reportId}.pdf
 */

export const userDoc = (uid: string) => `users/${uid}`;
export const patientsCol = (uid: string) => `users/${uid}/patients`;
export const studiesCol = (uid: string) => `users/${uid}/studies`;
export const auditCol = (uid: string) => `users/${uid}/auditLog`;
export const studySub = (
  uid: string,
  studyId: string,
  sub: "versions" | "aiRuns" | "reports"
) => `users/${uid}/studies/${studyId}/${sub}`;

const studyStorageBase = (uid: string, patientId: string, studyId: string) =>
  `users/${uid}/patients/${patientId}/studies/${studyId}`;

export const radiographPath = (
  uid: string,
  patientId: string,
  studyId: string,
  uploadId: string,
  ext: string
) => `${studyStorageBase(uid, patientId, studyId)}/radiograph/${uploadId}.${ext}`;

export const reportPath = (
  uid: string,
  patientId: string,
  studyId: string,
  reportId: string
) => `${studyStorageBase(uid, patientId, studyId)}/reports/${reportId}.pdf`;
