import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { placeOrder } from '../hooks/useOrders';
import { formatMoney } from '../utils/format';
import { generateQuotationPdf } from '../utils/quotation';
import { Button } from '../components/ui/Button';
import type { OrderWithItems } from '../types';

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderWithItems | null>(null);

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <ShoppingBag size={40} className="text-charcoal/40" />
        <h2 className="font-display text-xl font-bold">Your cart is empty</h2>
        <p className="text-sm text-charcoal/60">Add something from the catalogue first.</p>
        <Button onClick={() => navigate('/')}>Browse Catalogue</Button>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const { order, error: submitError } = await placeOrder({
      customerName: name.trim(),
      customerPhone: phone.trim(),
      studentId: studentId.trim(),
      notes: notes.trim(),
      items,
    });
    setSubmitting(false);
    if (submitError || !order) {
      setError(submitError ?? 'Something went wrong placing your order.');
      return;
    }
    const orderWithItems: OrderWithItems = {
      ...order,
      order_items: items.map((item, i) => ({
        id: `local-${i}`,
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
    };
    setPlacedOrder(orderWithItems);
    clear();
  }

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="plate-clip bg-parchment-100 p-8 text-center shadow-plate ring-1 ring-charcoal/5"
        >
          <CheckCircle2 size={48} className="mx-auto text-signal-green" />
          <h2 className="mt-4 font-display text-2xl font-bold">Order placed!</h2>
          <p className="mt-2 text-sm text-charcoal/60">
            Your order number is
          </p>
          <p className="mt-1 font-display text-xl font-bold text-oxblood-600">
            {placedOrder.order_number}
          </p>
          <p className="mt-3 text-sm text-charcoal/60">
            Total due on collection: <strong>{formatMoney(placedOrder.total)}</strong>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button icon={<Download size={16} />} onClick={() => generateQuotationPdf(placedOrder)}>
              Save Quotation (PDF)
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Back to Catalogue
            </Button>
          </div>
          <p className="mt-6 text-xs text-charcoal/45">
            Keep your order number and phone number — you'll need them to track your
            order status.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Place Your Order</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        This creates a quotation — payment happens when you collect your order.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-5">
        <form onSubmit={handleSubmit} className="sm:col-span-3">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">Full name *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
                placeholder="e.g. Tendai Moyo"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Phone number *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
                placeholder="e.g. 077 123 4567"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Student / Staff ID (optional)</label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
                placeholder="e.g. Collecting around 1pm"
              />
            </div>
            {error && <p className="text-sm font-medium text-signal-rust">{error}</p>}
            <Button type="submit" size="lg" loading={submitting}>
              Confirm Order
            </Button>
          </div>
        </form>

        <div className="sm:col-span-2">
          <div className="plate-clip-sm bg-charcoal-800 p-4 text-parchment-100">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-parchment-100/70">
              Order Summary
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-2">
                  <span className="text-parchment-100/80">
                    {item.quantity} &times; {item.name}
                  </span>
                  <span className="font-semibold">{formatMoney(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-parchment-100/15 pt-3 text-base font-bold">
              <span>Total</span>
              <span>{formatMoney(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
