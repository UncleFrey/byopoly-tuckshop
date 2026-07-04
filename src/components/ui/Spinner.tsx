export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-charcoal/60">
      <span className="h-8 w-8 rounded-full border-4 border-oxblood-600/20 border-t-oxblood-600 animate-spin" />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
