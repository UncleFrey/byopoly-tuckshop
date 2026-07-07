import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCategories, useProducts } from '../hooks/useProducts';
import { CategoryFilter } from '../components/catalogue/CategoryFilter';
import { ProductGrid } from '../components/catalogue/ProductGrid';
import { Spinner } from '../components/ui/Spinner';

export function HomePage() {
  const { products, loading: productsLoading } = useProducts();
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !activeCategory || p.category_id === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div>
      {/* Hero */}
      <section className="blueprint-grid relative overflow-hidden bg-charcoal py-14 text-parchment-100 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <span className="hex mb-4 inline-flex items-center bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-charcoal">
              Fresh Daily
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
              Fuel your workshop day.
            </h1>
            <p className="mt-4 text-base text-parchment-100/70 sm:text-lg">
              Order ahead from the SKY SILHOUETTE Online shop — build your cart,
              get an instant quotation, and collect at the counter. No queues, no
              guesswork.
            </p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-oxblood-600/30 blur-3xl" />
      </section>

      {/* Catalogue */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search the menu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-charcoal/15 bg-parchment-100 px-4 py-2.5 text-sm outline-none focus:border-oxblood-600 sm:w-72"
          />
        </div>

        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            activeId={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {productsLoading ? (
          <Spinner label="Loading the menu…" />
        ) : (
          <ProductGrid products={filtered} />
        )}
      </section>
    </div>
  );
}
