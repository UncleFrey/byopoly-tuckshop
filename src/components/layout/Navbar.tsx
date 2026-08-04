import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, PackageSearch, ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';



const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? 'text-blue-600' : 'text-charcoal/80 hover:text-charcoal'
  }`;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3 rounded-md bg-white px-1 py-1">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-white">
            <img
              src={logo}
              alt="Sky Silhouette"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-[0.16em] text-charcoal">
              SKY SILHOUETTE
            </span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-charcoal/70 sm:block">
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
            className="hidden rounded-md p-2 text-charcoal/80 hover:bg-charcoal/10 hover:text-charcoal md:hidden lg:flex"
            aria-label="Track order"
          >
            <PackageSearch size={20} />
          </Link>
          <button
            onClick={toggleCart}
            className="relative rounded-md p-2 text-charcoal hover:bg-charcoal/10"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white animate-pop">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className="rounded-md p-2 text-charcoal md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-charcoal/10 bg-white px-4 py-3 md:hidden">
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
