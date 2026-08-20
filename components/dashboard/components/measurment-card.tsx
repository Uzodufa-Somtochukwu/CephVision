export function MeasurementCard({
  name,
  fullName,
  value,
  unit = "°",
  norm,
  interpretation,
  status,
}: {
  name: string;
  fullName: string;
  value?: string | number;
  unit?: string;
  norm: string;
  interpretation?: string;
  status?: "normal" | "low" | "high" | "pending";
}) {
  const pending =
    value === undefined ||
    value === null ||
    value === "—" ||
    status === "pending";

  let statusText = "Normal";
  let statusClass =
    "bg-green-50 text-green-700 border-green-100";

  if (pending) {
    statusText = "Pending";
    statusClass =
      "bg-slate-50 text-slate-500 border-slate-200";
  } else if (status === "high") {
    statusText = "Increased";
    statusClass =
      "bg-amber-50 text-amber-700 border-amber-100";
  } else if (status === "low") {
    statusText = "Decreased";
    statusClass =
      "bg-red-50 text-red-700 border-red-100";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">
            {name}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {fullName}
          </p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusClass}`}
        >
          {statusText}
        </span>
      </div>

      <div className="mt-5">
        <span className="text-3xl font-bold text-[#166534]">
          {pending
            ? "—"
            : `${value}${unit}`}
        </span>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Reference
        </p>

        <p className="mt-1 text-xs font-medium text-slate-700">
          {norm}
        </p>
      </div>

      {interpretation && (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {interpretation}
        </p>
      )}
    </div>
  );
}