import { Card } from "@/elements/card";

export function TreatmentCard({
  title,
  duration,
  description,
  phases,
}: {
  title: string;
  duration: string;
  description: string;
  phases: any[];
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
            Treatment Option
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {title}
          </h3>
        </div>

        <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
          {duration}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {phases.length > 0 && (
        <div className="mt-5 space-y-2">
          {phases.map(
            (phase, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex gap-3">
                  <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-[#166534] shadow-sm">
                    {phase.stage ||
                      `Stage ${index + 1}`}
                  </span>

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {phase.title}
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {phase.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Card>
  );
}