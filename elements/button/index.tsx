export function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-[#166534] text-white hover:bg-[#14532d] shadow-sm shadow-green-900/10",
    secondary:
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger:
      "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex cursor-pointer items-center justify-center gap-2
        rounded-xl px-4 py-2.5
        text-sm font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}