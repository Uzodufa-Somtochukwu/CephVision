import { Button } from "@/elements/button";
import { CephStudy } from "@/types";
import { formatDate, formatDateTime } from "@/utils/helpers";
import { ArrowLeft, Calendar, ChevronRight, Plus,History } from "lucide-react";

export function PatientHistory({
  study,
  studies,
  onBack,
  onOpenStudy,
  onNewAnalysis,
}: {
  study: CephStudy;
  studies: CephStudy[];
  onBack: () => void;
  onOpenStudy: (study: CephStudy) => void;
  onNewAnalysis: (val:string) => void | any;
}) {
  const patientStudies = studies
    .filter(
      (item) =>
        item.patient.id === study.patient.id
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    );
    const patientID = patientStudies[0].patient.id

  return (
    <div className="min-h-screen bg-[#f7faf8]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Button
            variant="ghost"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Patients
          </Button>

          {/* <Button onClick={onNewAnalysis(patientID as string)}>
            <Plus className="h-4 w-4" />
            New Analysis
          </Button> */}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-xl font-bold text-[#166534]">
                {study.patient.name
                  ?.charAt(0)
                  .toUpperCase() || "P"}
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {study.patient.name ||
                    "Unnamed Patient"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {study.patient.id}
                  {study.patient.age
                    ? ` · ${study.patient.age} years`
                    : ""}
                  {study.patient.sex
                    ? ` · ${study.patient.sex}`
                    : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Analyses
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {patientStudies.length}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                  Latest
                </p>

                <p className="mt-1 text-sm font-bold text-green-900">
                  {formatDate(
                    patientStudies[0]?.updatedAt
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-[#166534]" />

            <h2 className="text-lg font-bold text-slate-900">
              Analysis History
            </h2>
          </div>

          <div className="space-y-3">
            {patientStudies.map(
              (item, index) => {
                const anb =
                  item.analysisData?.measurements
                    ?.ANB?.value;

                const classification =
                  item.analysisData?.malocclusion
                    ?.classification ||
                  item.selectedMalocclusion;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      onOpenStudy(item)
                    }
                    className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-slate-500">
                          {patientStudies.length -
                            index}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-slate-900">
                              Cephalometric Analysis
                            </p>

                            {item.analysisData && (
                              <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                                Complete
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDateTime(
                                item.updatedAt
                              )}
                            </span>

                            <span>
                              {item.landmarks?.[0]
                                ?.keypoints?.length ||
                                0}{" "}
                              landmarks
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Classification
                          </p>

                          <p className="mt-1 text-sm font-bold text-[#166534]">
                            {classification ||
                              "Pending"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            ANB
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {anb !== undefined
                              ? `${anb}°`
                              : "—"}
                          </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#166534]" />
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
