import { useState } from 'react';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import type { OrderStatus, OrderWithItems } from '../../types';
import { formatDate, formatMoney, STATUS_COLOR, STATUS_LABEL } from '../../utils/format';
import { updateOrderStatus } from '../../hooks/useOrders';
import { generateQuotationPdf } from '../../utils/quotation';
import { Badge } from '../ui/Badge';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'ready', 'completed', 'cancelled'];

export function OrderTable({ orders }: { orders: OrderWithItems[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (orders.length === 0) {
    return <p className="py-10 text-center text-sm text-charcoal/50">No orders yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => {
        const expanded = expandedId === order.id;
        return (
          <div
            key={order.id}
            className="rounded-lg border border-charcoal/10 bg-parchment-100 shadow-sm"
          >
            <button
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              onClick={() => setExpandedId(expanded ? null : order.id)}
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-bold">
                  {order.order_number} &middot; {order.customer_name}
                </p>
                <p className="text-xs text-charcoal/50">
                  {formatDate(order.created_at)} &middot; {order.customer_phone}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold">{formatMoney(order.total)}</span>
                <Badge className={STATUS_COLOR[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {expanded && (
              <div className="border-t border-charcoal/10 px-4 py-3">
                <ul className="space-y-1 text-sm">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity} &times; {item.product_name}
                      </span>
                      <span className="font-semibold">{formatMoney(item.subtotal)}</span>
                    </li>
                  ))}
                </ul>
                {order.notes && (
                  <p className="mt-2 text-xs italic text-charcoal/50">Note: {order.notes}</p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold text-charcoal/60">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => void updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="rounded-md border border-charcoal/15 px-2 py-1 text-sm outline-none focus:border-oxblood-600"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => generateQuotationPdf(order)}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-charcoal/15 px-3 py-1.5 text-xs font-semibold text-charcoal/70 hover:bg-charcoal/5"
                  >
                    <Download size={14} /> Quotation
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
