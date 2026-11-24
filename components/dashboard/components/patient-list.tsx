import { Button } from "@/elements/button";
import { UserMenu } from "@/elements/user-menu";
import { CephStudy } from "@/types";
import { formatDate } from "@/utils/helpers";
import { Activity, AlertTriangle, ChevronRight, Plus, Search, Upload, User, Users } from "lucide-react";
import { useState } from "react";

export function PatientList({
  allPatient,
  studies,
  onNewAnalysis,
  onOpenPatient,
  onSignOut,
  clinicianName,
  loadError,
  legacyCount,
  importStatus,
  onImportLocal,
}: {
  studies: CephStudy[];
  allPatient: {
    latest:CephStudy;
    count:number
  }[]
  onNewAnalysis: () => void;
  onOpenPatient: (study: CephStudy) => void;
  onSignOut: () => void;
  clinicianName: string;
  loadError: string | null;
  /** Analyses still stored only in this browser (pre-Firebase version). */
  legacyCount: number;
  importStatus: string | null;
  onImportLocal: () => void;
}) {
  const [search, setSearch] = useState("");

  
    const patients = allPatient.filter(({ latest }) => {
      const query = search.toLowerCase().trim();

      if (!query) return true;

      return (
        latest.patient.name
          ?.toLowerCase()
          .includes(query) ||
        latest.patient.id
          ?.toLowerCase()
          .includes(query)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.latest.updatedAt).getTime() -
        new Date(a.latest.updatedAt).getTime()
    );

  return (
    <div className="min-h-screen bg-[#f7faf8]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#166534] sm:h-10 sm:w-10">
              <Activity className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900">
                Ceph<span className="text-[#166534]">Vision</span>
              </h1>

              <p className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Cephalometric Diagnostic Suite
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button onClick={onNewAnalysis} title="New Analysis">
              <Plus className="h-4 w-4" />
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">New Analysis</span>
            </Button>

            <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

            <UserMenu name={clinicianName} onSignOut={onSignOut} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">
        {loadError && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {loadError}
          </div>
        )}

        {legacyCount > 0 && (
          <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-sm text-amber-900">
              {legacyCount} {legacyCount === 1 ? "analysis is" : "analyses are"} saved
              only in this browser. Import them into your account so they are
              backed up and available on other devices.
            </p>

            <Button
              variant="secondary"
              onClick={onImportLocal}
              disabled={!!importStatus}
            >
              <Upload className="h-4 w-4" />
              {importStatus ?? "Import"}
            </Button>
          </div>
        )}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#166534]">
              Patient Records
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Patients
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Search patients and reopen their previous
              cephalometric analyses.
            </p>
          </div>

          <div className="w-full rounded-xl border border-green-100 bg-green-50 px-4 py-3 md:w-auto">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#166534]" />

              <div>
                <p className="text-xs text-green-700">
                  Total Patients
                </p>

                <p className="text-lg font-bold text-green-900">
                  {patients.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-7">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient name or patient ID..."
            className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:ring-4 focus:ring-green-100"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {patients.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                <User className="h-7 w-7 text-[#166534]" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No patients found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Start your first cephalometric analysis
                to create a patient record.
              </p>

              <Button
                className="mt-5"
                onClick={onNewAnalysis}
              >
                <Plus className="h-4 w-4" />
                Create First Analysis
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[1.7fr_1fr_0.8fr_0.9fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 md:grid">
                <span>Patient</span>
                <span>Patient ID</span>
                <span>Analyses</span>
                <span>Last Analysis</span>
                <span />
              </div>

              {patients.map(({ latest, count }) => (
                <button
                  key={latest.patientId}
                  onClick={() =>
                    onOpenPatient(latest)
                  }
                  className="group grid w-full grid-cols-1 gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5 text-left transition last:border-0 hover:bg-green-50/40 md:grid-cols-[1.7fr_1fr_0.8fr_0.9fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 font-bold text-[#166534]">
                      {latest.patient.name
                        ?.charAt(0)
                        .toUpperCase() || "P"}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {latest.patient.name ||
                          "Unnamed Patient"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {latest.patient.age
                          ? `${latest.patient.age} years`
                          : "Age not recorded"}
                        {latest.patient.sex
                          ? ` · ${latest.patient.sex}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-slate-600">
                    {latest.patient.id || "—"}
                  </span>

                  <span className="text-sm font-semibold text-[#166534]">
                    {count}
                  </span>

                  <span className="text-sm text-slate-500">
                    {formatDate(latest.updatedAt)}
                  </span>

                  <ChevronRight className="hidden h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#166534] md:block" />
                </button>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}