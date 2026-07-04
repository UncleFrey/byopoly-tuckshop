import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { ImagePlus } from 'lucide-react';
import type { Category, Product } from '../../types';
import { createProduct, updateProduct, uploadProductImage } from '../../hooks/useProducts';
import { Button } from '../ui/Button';

interface ProductFormProps {
  categories: Category[];
  product?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProductForm({ categories, product, onSaved, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [categoryId, setCategoryId] = useState<string>(product?.category_id ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error: uploadError } = await uploadProductImage(file);
    setUploading(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setImageUrl(url);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsedPrice = parseFloat(price);
    if (!name.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Please provide a valid name and price.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      category_id: categoryId || null,
      image_url: imageUrl,
      in_stock: inStock,
    };

    const { error: saveError } = product
      ? await updateProduct(product.id, payload)
      : await createProduct(payload);

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-semibold">Item name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Price (USD) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-charcoal/15 px-3 py-2.5 text-sm outline-none focus:border-oxblood-600"
          >
            <option value="">Uncategorised</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Photo</label>
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-charcoal-800">
            {imageUrl && <img src={imageUrl} alt="" className="h-full w-full object-cover" />}
          </div>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-charcoal/15 px-3 py-2 text-sm font-semibold text-charcoal/70 hover:bg-charcoal/5">
            <ImagePlus size={16} />
            {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="h-4 w-4 rounded border-charcoal/30"
        />
        In stock
      </label>

      {error && <p className="text-sm font-medium text-signal-rust">{error}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving || uploading}>
          {product ? 'Save changes' : 'Add item'}
        </Button>
      </div>
    </form>
  );
}
