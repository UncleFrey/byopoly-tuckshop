import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { LogOut, Package, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStaffOrders } from '../hooks/useOrders';
import { OrderTable } from '../components/admin/OrderTable';
import { Spinner } from '../components/ui/Spinner';
import type { OrderStatus } from '../types';

const FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Ready', value: 'ready' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function DashboardPage() {
  const { profile, signOut } = useAuth();
  const { orders, loading } = useStaffOrders();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('pending');

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Order Dashboard</h1>
          <p className="text-sm text-charcoal/60">
            Signed in as {profile?.full_name} ({profile?.role})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/products"
            className="inline-flex items-center gap-1.5 rounded-md border border-charcoal/15 px-3 py-2 text-sm font-semibold text-charcoal/70 hover:bg-charcoal/5"
          >
            <UtensilsCrossed size={16} /> Manage Catalogue
          </Link>
          <button
            onClick={() => void signOut()}
            className="inline-flex items-center gap-1.5 rounded-md border border-charcoal/15 px-3 py-2 text-sm font-semibold text-charcoal/70 hover:bg-charcoal/5"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md bg-amber-500/15 px-4 py-2.5 text-sm font-semibold text-amber-600">
        <Package size={16} />
        {pendingCount} order{pendingCount === 1 ? '' : 's'} awaiting preparation
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
              filter === f.value
                ? 'border-oxblood-600 bg-oxblood-600 text-parchment-100'
                : 'border-charcoal/15 text-charcoal/70 hover:border-oxblood-400'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {loading ? <Spinner label="Loading orders…" /> : <OrderTable orders={filtered} />}
      </div>
    </div>
  );
}
