import { useState } from 'react';
import { PackageOpen } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center text-charcoal/50">
        <PackageOpen size={40} />
        <p className="text-sm font-medium">No items in this category right now.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 ${expandedId ? 'pointer-events-none select-none' : ''}`}>
        {products.map((product, i) => (
          <div key={product.id} className={expandedId && expandedId !== product.id ? 'opacity-50' : ''}>
            <ProductCard
              product={product}
              index={i}
              expanded={expandedId === product.id}
              onExpand={() => setExpandedId(product.id)}
              onCollapse={() => setExpandedId(null)}
            />
          </div>
        ))}
      </div>

      {expandedId && (
        <div
          className="fixed inset-0 z-30 bg-charcoal/35 backdrop-blur-[2px]"
          onClick={() => setExpandedId(null)}
        />
      )}
    </div>
  );
}
