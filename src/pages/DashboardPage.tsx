import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, LogOut, Package, UtensilsCrossed } from 'lucide-react';
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

const PAGE_SIZE = 8;

export function DashboardPage() {
  const { profile, signOut } = useAuth();
  const { orders, loading } = useStaffOrders();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('pending');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);
    return [...filteredOrders].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return bTime - aTime;
    });
  }, [orders, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  };

  const handleFilterChange = (nextFilter: OrderStatus | 'all') => {
    setFilter(nextFilter);
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [filter]);

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
            onClick={() => handleFilterChange(f.value)}
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
        {loading ? (
          <Spinner label="Loading orders…" />
        ) : (
          <>
            <OrderTable orders={pagedOrders} />
            {filtered.length > PAGE_SIZE && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-charcoal/10 bg-parchment-100 px-4 py-3 text-sm text-charcoal/70">
                <span>
                  Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 rounded-md border border-charcoal/15 px-2.5 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1 rounded-md border border-charcoal/15 px-2.5 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
