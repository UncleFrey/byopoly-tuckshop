import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { CartItem, OrderStatus, OrderWithItems } from '../types';

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BP-${y}${m}${d}-${rand}`;
}

export interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  studentId?: string;
  notes?: string;
  items: CartItem[];
}

export async function placeOrder(input: PlaceOrderInput) {
  const orderNumber = generateOrderNumber();
  const total = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      student_id: input.studentId || null,
      notes: input.notes || null,
      status: 'pending',
      total,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { order: null, error: orderError?.message ?? 'Could not create order' };
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    unit_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    return { order: null, error: itemsError.message };
  }

  return { order, error: null };
}

export async function lookupOrder(orderNumber: string, phone: string) {
  const { data, error } = await supabase.rpc('get_order_by_number_and_phone', {
    p_order_number: orderNumber.trim(),
    p_phone: phone.trim(),
  });
  if (error) return { order: null, error: error.message };
  const rows = (data ?? []) as OrderWithItems[];
  if (rows.length === 0) return { order: null, error: 'No matching order found. Check the order number and phone number.' };
  return { order: rows[0], error: null };
}

/** For staff/admin dashboards — requires an authenticated staff/admin session (RLS-enforced). */
export function useStaffOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setOrders((data ?? []) as OrderWithItems[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => void refresh()
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return { orders, loading, error, refresh };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return supabase.from('orders').update({ status }).eq('id', id);
}
