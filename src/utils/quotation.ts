import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { OrderWithItems } from '../types';
import { formatDate, formatMoney } from './format';
import logo from '../assets/logo.png';

export function generateQuotationPdf(order: OrderWithItems) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const dark = '#111111';
  const muted = '#64748B';
  const light = '#FFFFFF';

  doc.setFillColor(light);
  doc.rect(0, 0, 595, 102, 'F');
  doc.setDrawColor('#E2E8F0');
  doc.setLineWidth(1);
  doc.line(40, 100, 555, 100);

  doc.setTextColor(dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SKY SILHOUETTES', 110, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Cnr 12th Ave / Park Road, Bulawayo, Zimbabwe', 110, 58);
  doc.text('Order Quotation', 110, 74);

  try {
    doc.addImage(logo, 'PNG', 40, 18, 65, 46);
  } catch {
    // Fall back to text if the logo cannot be embedded.
  }

  doc.setTextColor(dark);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order No: ${order.order_number}`, 40, 128);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(order.created_at)}`, 40, 144);
  doc.text(`Customer: ${order.customer_name}`, 40, 160);
  doc.text(`Phone: ${order.customer_phone}`, 40, 176);
  if (order.student_id) {
    doc.text(`Student/Staff ID: ${order.student_id}`, 40, 192);
  }

  autoTable(doc, {
    startY: 215,
    head: [['Item', 'Qty', 'Unit Price', 'Subtotal']],
    body: order.order_items.map((item) => [
      item.product_name,
      String(item.quantity),
      formatMoney(item.unit_price),
      formatMoney(item.subtotal),
    ]),
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 10, cellPadding: 6, textColor: dark },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // jspdf-autotable augments the doc instance with lastAutoTable at runtime.
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(dark);
  doc.text(`Total: ${formatMoney(order.total)}`, 400, finalY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(muted);
  doc.text('This is a quotation only — no payment has been made.', 40, finalY + 58);
  doc.text('Please keep your order number handy for the tuckshop counter.', 40, finalY + 72);

  if (order.notes) {
    doc.text(`Notes: ${order.notes}`, 40, finalY + 94);
  }

  doc.save(`quotation-${order.order_number}.pdf`);
}
