import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, PackageSearch, ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? 'text-amber-500' : 'text-parchment-100/80 hover:text-parchment-100'
  }`;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-charcoal shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="hex flex h-9 w-9 items-center justify-center bg-oxblood-600 font-display text-lg font-bold text-parchment-100">
            BP
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-parchment-100">
              SKY SILHOUETTE
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-parchment-100/50 sm:block">
              Anchored in the real world of production
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Catalogue
          </NavLink>
          <NavLink to="/track-order" className={navLinkClass}>
            Track Order
          </NavLink>
          {profile && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {!profile && (
            <NavLink to="/staff-login" className={navLinkClass}>
              Staff Login
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/track-order"
            className="hidden rounded-md p-2 text-parchment-100/80 hover:bg-parchment-100/10 hover:text-parchment-100 md:hidden lg:flex"
            aria-label="Track order"
          >
            <PackageSearch size={20} />
          </Link>
          <button
            onClick={toggleCart}
            className="relative rounded-md p-2 text-parchment-100 hover:bg-parchment-100/10"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-charcoal animate-pop">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="rounded-md p-2 text-parchment-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-parchment-100/10 bg-charcoal px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} end onClick={() => setMobileOpen(false)}>
              Catalogue
            </NavLink>
            <NavLink to="/track-order" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Track Order
            </NavLink>
            {profile ? (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/staff-login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                Staff Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
