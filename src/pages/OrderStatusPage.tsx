import { useState } from 'react';
import type { FormEvent } from 'react';
import { Download, Search } from 'lucide-react';
import { lookupOrder } from '../hooks/useOrders';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate, formatMoney, STATUS_COLOR, STATUS_LABEL } from '../utils/format';
import { generateQuotationPdf } from '../utils/quotation';
import type { OrderWithItems } from '../types';

export function OrderStatusPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderWithItems | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError('Enter both your order number and phone number.');
      return;
    }
    setLoading(true);
    setError(null);
    setOrder(null);
    const result = await lookupOrder(orderNumber, phone);
    setLoading(false);
    if (result.error || !result.order) {
      setError(result.error ?? 'Order not found.');
      return;
    }
    setOrder(result.order);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Track Your Order</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Enter your order number and phone number to check its status.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Order number</label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. BP-260704-1234"
            className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Phone number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="The number you used at checkout"
            className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
          />
        </div>
        {error && <p className="text-sm font-medium text-signal-rust">{error}</p>}
        <Button type="submit" icon={<Search size={16} />} loading={loading}>
          Check Status
        </Button>
      </form>

      {order && (
        <div className="plate-clip mt-8 bg-parchment-100 p-6 shadow-plate ring-1 ring-charcoal/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-lg font-bold">{order.order_number}</p>
              <p className="text-xs text-charcoal/50">{formatDate(order.created_at)}</p>
            </div>
            <Badge className={STATUS_COLOR[order.status]}>{STATUS_LABEL[order.status]}</Badge>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {order.order_items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.quantity} &times; {item.product_name}
                </span>
                <span className="font-semibold">{formatMoney(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-charcoal/10 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
          <Button
            variant="ghost"
            className="mt-4 w-full"
            icon={<Download size={16} />}
            onClick={() => generateQuotationPdf(order)}
          >
            Download Quotation Again
          </Button>
        </div>
      )}
    </div>
  );
}
