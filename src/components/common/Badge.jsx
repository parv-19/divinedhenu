export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full border border-ritual-border bg-ritual-card/80 px-3 py-1 text-xs font-semibold text-ritual-muted ${className}`}>
      {children}
    </span>
  );
}
