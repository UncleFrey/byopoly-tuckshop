import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, UtensilsCrossed, X } from 'lucide-react';
import type { Product } from '../../types';
import { formatMoney } from '../../utils/format';
import { useCartStore } from '../../store/cartStore';

export function ProductCard({
  product,
  index = 0,
  expanded,
  onExpand,
  onCollapse,
}: {
  product: Product;
  index?: number;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!expanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded, onCollapse]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04, ease: 'easeOut' }}
      animate={{
        scale: expanded ? 1.03 : 1,
        y: expanded ? -6 : 0,
        zIndex: expanded ? 40 : 1,
      }}
      whileTap={{ scale: 0.98 }}
      onClick={(event) => {
        if (expanded) {
          event.stopPropagation();
          return;
        }
        onExpand();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!expanded) {
            onExpand();
          }
        }
      }}
      className={`plate-clip group relative flex flex-col overflow-hidden bg-parchment-100 shadow-plate ring-1 ring-charcoal/5 transition-all duration-300 ${expanded ? 'shadow-2xl ring-charcoal/15' : 'cursor-pointer hover:-translate-y-1'}`}
    >
      <div className={`relative w-full overflow-hidden bg-charcoal-800 transition-all duration-300 ${expanded ? 'aspect-[3/2]' : 'aspect-[4/3]'}`}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition-all duration-300 ${expanded ? 'scale-110' : 'group-hover:scale-105'}`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-parchment-100/30">
            <UtensilsCrossed size={36} />
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal/70">
            <span className="rounded-full bg-charcoal px-3 py-1 text-xs font-bold uppercase tracking-wide text-parchment-100">
              Out of stock
            </span>
          </div>
        )}
        <div className="plate-clip-sm absolute right-0 top-0 bg-amber-500 px-3 py-1.5 text-sm font-bold text-charcoal shadow-md">
          {formatMoney(product.price)}
        </div>
        {expanded && (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onCollapse();
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-charcoal shadow-lg backdrop-blur"
            aria-label="Close expanded view"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-sm text-charcoal/60">{product.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className={`text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-600 transition-opacity ${expanded ? 'opacity-100' : 'opacity-75'}`}>
            {expanded ? 'Expanded view' : 'Tap to enlarge'}
          </span>
          <button
            onClick={(event) => {
              event.stopPropagation();
              addItem(product);
              onCollapse();
            }}
            disabled={!product.in_stock}
            className="inline-flex items-center gap-1.5 rounded-md bg-oxblood-600 px-3.5 py-2 text-sm font-semibold text-parchment-100 transition-all hover:bg-oxblood-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-charcoal/20 disabled:text-charcoal/40"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
