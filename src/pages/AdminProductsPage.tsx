import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useCategories, useProducts } from '../hooks/useProducts';
import { ProductTable } from '../components/admin/ProductTable';
import { ProductForm } from '../components/admin/ProductForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import type { Product } from '../types';

export function AdminProductsPage() {
  const { products, loading, refresh } = useProducts({ includeInactive: true });
  const { categories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    void refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal/60 hover:text-charcoal"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">Manage Catalogue</h1>
        <Button icon={<Plus size={16} />} onClick={openAddModal}>
          Add Item
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner label="Loading catalogue…" />
        ) : (
          <ProductTable products={products} onEdit={openEditModal} />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Item' : 'Add Item'}
      >
        <ProductForm
          categories={categories}
          product={editingProduct}
          onSaved={handleSaved}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
