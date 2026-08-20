import { Button } from "@/elements/button";
import { CephStudy } from "@/types";
import { formatDate } from "@/utils/helpers";
import { Activity, ChevronRight, Plus, Search, User, Users } from "lucide-react";
import { useState } from "react";

export function PatientList({
  studies,
  onNewAnalysis,
  onOpenPatient,
}: {
  studies: CephStudy[];
  onNewAnalysis: () => void;
  onOpenPatient: (study: CephStudy) => void;
}) {
  const [search, setSearch] = useState("");

  const groupedPatients = studies.reduce<
    Record<string, CephStudy[]>
  >((acc, study) => {
    const patientId =
      study.patient.id || study.patient.name;

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
    .filter(({ latest }) => {
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#166534]">
              <Activity className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900">
                Ceph<span className="text-[#166534]">Vision</span>
              </h1>

              <p className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
                Cephalometric Diagnostic Suite
              </p>
            </div>
          </div>

          <Button onClick={onNewAnalysis}>
            <Plus className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#166534]">
              Patient Records
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Patients
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
              Search patients and reopen their previous
              cephalometric analyses.
            </p>
          </div>

          <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
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
                  key={latest.patient.id}
                  onClick={() =>
                    onOpenPatient(latest)
                  }
                  className="group grid w-full grid-cols-1 gap-3 border-b border-slate-100 px-5 py-5 text-left transition last:border-0 hover:bg-green-50/40 md:grid-cols-[1.7fr_1fr_0.8fr_0.9fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
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