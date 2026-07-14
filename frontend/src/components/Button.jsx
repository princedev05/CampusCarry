export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const styles = {
    primary:
      "bg-[var(--primary)] text-[#16120a] hover:brightness-105 disabled:brightness-90",
    ghost:
      "border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]",
    danger:
      "bg-[var(--danger)] text-white hover:brightness-110",
    success:
      "bg-[var(--success)] text-[#042117] hover:brightness-110",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
