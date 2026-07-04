import { Edit2, EyeOff, Eye, Trash2, UtensilsCrossed } from 'lucide-react';
import type { Product } from '../../types';
import { formatMoney } from '../../utils/format';
import { deleteProduct, setProductActive } from '../../hooks/useProducts';
import { Badge } from '../ui/Badge';

export function ProductTable({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
}) {
  async function handleToggleActive(product: Product) {
    await setProductActive(product.id, !product.is_active);
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Remove "${product.name}" permanently? This cannot be undone.`)) return;
    await deleteProduct(product.id);
  }

  if (products.length === 0) {
    return <p className="py-10 text-center text-sm text-charcoal/50">No items yet — add your first one.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-charcoal/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-charcoal-800 text-parchment-100/70">
          <tr>
            <th className="px-4 py-2.5 font-semibold">Item</th>
            <th className="px-4 py-2.5 font-semibold">Price</th>
            <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Status</th>
            <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal/8 bg-parchment-100">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-charcoal-800">
                    {product.image_url ? (
                      <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-parchment-100/30">
                        <UtensilsCrossed size={16} />
                      </div>
                    )}
                  </div>
                  <span className="font-semibold">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">{formatMoney(product.price)}</td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    className={
                      product.is_active
                        ? 'border-signal-green/30 bg-signal-green/15 text-signal-green'
                        : 'border-charcoal/20 bg-charcoal/10 text-charcoal/50'
                    }
                  >
                    {product.is_active ? 'Active' : 'Deactivated'}
                  </Badge>
                  {!product.in_stock && (
                    <Badge className="border-signal-rust/30 bg-signal-rust/15 text-signal-rust">
                      Out of stock
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-md p-1.5 text-charcoal/60 hover:bg-charcoal/5"
                    aria-label="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => void handleToggleActive(product)}
                    className="rounded-md p-1.5 text-charcoal/60 hover:bg-charcoal/5"
                    aria-label={product.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {product.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => void handleDelete(product)}
                    className="rounded-md p-1.5 text-signal-rust/70 hover:bg-signal-rust/10"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
