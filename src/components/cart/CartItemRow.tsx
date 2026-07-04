import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '../../types';
import { formatMoney } from '../../utils/format';
import { useCartStore } from '../../store/cartStore';

export function CartItemRow({ item }: { item: CartItem }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex items-center gap-3 border-b border-charcoal/8 py-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-charcoal-800">
        {item.image_url && (
          <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-charcoal">{item.name}</p>
        <p className="text-xs text-charcoal/50">{formatMoney(item.price)} each</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setQuantity(item.productId, item.quantity - 1)}
          className="rounded-md border border-charcoal/15 p-1 text-charcoal/70 hover:bg-charcoal/5"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => setQuantity(item.productId, item.quantity + 1)}
          className="rounded-md border border-charcoal/15 p-1 text-charcoal/70 hover:bg-charcoal/5"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        onClick={() => removeItem(item.productId)}
        className="ml-1 rounded-md p-1.5 text-signal-rust/70 hover:bg-signal-rust/10"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
