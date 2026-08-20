export function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span className="text-xs font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}