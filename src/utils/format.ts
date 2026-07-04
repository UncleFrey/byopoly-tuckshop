export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-ZW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  ready: 'Ready for collection',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  ready: 'bg-signal-green/15 text-signal-green border-signal-green/30',
  completed: 'bg-charcoal-700/10 text-charcoal-700 border-charcoal-700/20',
  cancelled: 'bg-signal-rust/15 text-signal-rust border-signal-rust/30',
};
