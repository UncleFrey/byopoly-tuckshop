import clsx from 'clsx';
import type { Category } from '../../types';

export function CategoryFilter({
  categories,
  activeId,
  onChange,
}: {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      <button
        onClick={() => onChange(null)}
        className={clsx(
          'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
          activeId === null
            ? 'border-oxblood-600 bg-oxblood-600 text-parchment-100'
            : 'border-charcoal/15 bg-parchment-100 text-charcoal/70 hover:border-oxblood-400'
        )}
      >
        All Items
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={clsx(
            'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
            activeId === cat.id
              ? 'border-oxblood-600 bg-oxblood-600 text-parchment-100'
              : 'border-charcoal/15 bg-parchment-100 text-charcoal/70 hover:border-oxblood-400'
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
