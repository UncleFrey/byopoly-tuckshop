import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { OrderWithItems } from '../types';
import { formatDate, formatMoney } from './format';

export function generateQuotationPdf(order: OrderWithItems) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const oxblood = '#7A1F2E';
  const charcoal = '#1E2023';

  doc.setFillColor(oxblood);
  doc.rect(0, 0, 595, 90, 'F');

  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SKY SILHOUETTE Investments', 40, 40);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Cnr 12th Ave / Park Road, Bulawayo, Zimbabwe', 40, 58);
  doc.text('Order Quotation — payable on collection', 40, 74);

  doc.setTextColor(charcoal);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Order No: ${order.order_number}`, 40, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(order.created_at)}`, 40, 136);
  doc.text(`Customer: ${order.customer_name}`, 40, 152);
  doc.text(`Phone: ${order.customer_phone}`, 40, 168);
  if (order.student_id) {
    doc.text(`Student/Staff ID: ${order.student_id}`, 40, 184);
  }

  autoTable(doc, {
    startY: 205,
    head: [['Item', 'Qty', 'Unit Price', 'Subtotal']],
    body: order.order_items.map((item) => [
      item.product_name,
      String(item.quantity),
      formatMoney(item.unit_price),
      formatMoney(item.subtotal),
    ]),
    headStyles: { fillColor: [30, 32, 35] },
    styles: { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  });

  // jspdf-autotable augments the doc instance with lastAutoTable at runtime.
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ${formatMoney(order.total)}`, 400, finalY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#5A5D62');
  doc.text(
    'This is a quotation only — no payment has been made. Please bring this quotation and',
    40,
    finalY + 60
  );
  doc.text(
    'settle payment on collection at the tuckshop counter. Keep your order number handy.',
    40,
    finalY + 74
  );

  if (order.notes) {
    doc.text(`Notes: ${order.notes}`, 40, finalY + 96);
  }

  doc.save(`quotation-${order.order_number}.pdf`);
}
