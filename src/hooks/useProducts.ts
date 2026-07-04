import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Category, Product } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error && data) setCategories(data as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { categories, loading, refresh };
}

interface UseProductsOptions {
  /** When true, includes inactive products too (for staff/admin management views). */
  includeInactive?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { includeInactive = false } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('products').select('*').order('name', { ascending: true });
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setProducts((data ?? []) as Product[]);
    }
    setLoading(false);
  }, [includeInactive]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => void refresh()
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { products, loading, error, refresh };
}

export async function createProduct(input: {
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  image_url: string | null;
  in_stock: boolean;
}) {
  return supabase.from('products').insert({ ...input, is_active: true });
}

export async function updateProduct(
  id: string,
  input: Partial<{
    name: string;
    description: string;
    price: number;
    category_id: string | null;
    image_url: string | null;
    in_stock: boolean;
    is_active: boolean;
  }>
) {
  return supabase.from('products').update(input).eq('id', id);
}

export async function setProductActive(id: string, isActive: boolean) {
  return supabase.from('products').update({ is_active: isActive }).eq('id', id);
}

export async function deleteProduct(id: string) {
  return supabase.from('products').delete().eq('id', id);
}

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
