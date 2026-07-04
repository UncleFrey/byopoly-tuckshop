import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { CartItemRow } from './CartItemRow';
import { Button } from '../ui/Button';
import { formatMoney } from '../../utils/format';

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-parchment-100 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShoppingBag size={20} /> Your Cart
              </h3>
              <button
                onClick={closeCart}
                className="rounded-md p-1.5 text-charcoal/50 hover:bg-charcoal/5"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-charcoal/50">
                  <ShoppingBag size={36} />
                  <p className="text-sm font-medium">Your cart is empty.</p>
                  <p className="text-xs">Browse the catalogue and add something tasty.</p>
                </div>
              ) : (
                items.map((item) => <CartItemRow key={item.productId} item={item} />)
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-charcoal/10 px-5 py-4">
                <div className="mb-3 flex items-center justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatMoney(totalPrice)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                >
                  Place Order
                </Button>
                <p className="mt-2 text-center text-xs text-charcoal/45">
                  You'll get a quotation to save — pay when you collect.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
