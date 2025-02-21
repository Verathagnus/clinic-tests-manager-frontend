// src/utils/generatePDF.ts
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

// src/types/invoice.ts
export interface Item {
  name: string;
  price: number;
}

export interface Invoice {
  id: number;
  patient_name: string;
  patient_age: number;
  patient_address: string;
  patient_phone: string;
  items: Item[];
  discount: number;
  amount_paid: number;
  remarks?: string;
}

export const generatePDF = (invoice: Invoice): Promise<string> => {
  const doc = new PDFDocument();
  const stream = doc.pipe(blobStream());

  // Header
  doc
    .fontSize(24)
    .fillColor('#007BFF')
    .text(`Invoice #${invoice.id}`, { align: 'center' })
    .moveDown();

  // Patient Details
  doc
    .fontSize(16)
    .fillColor('#333')
    .text('Patient Details', { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Name: ${invoice.patient_name}`)
    .text(`Age: ${invoice.patient_age}`)
    .text(`Address: ${invoice.patient_address}`)
    .text(`Phone: ${invoice.patient_phone}`)
    .moveDown();

  // Tests
  doc
    .fontSize(16)
    .fillColor('#333')
    .text('Tests', { underline: true })
    .moveDown(0.5);

  invoice.items.forEach((item) => {
    doc
      .fontSize(12)
      .text(`Test Name: ${item.name}`)
      .text(`Price: ₹${item.price}`)
      .moveDown(0.5);
  });

  // Summary
  const subtotal = invoice.items.reduce((total, item) => total + item.price, 0);
  const grandTotal = subtotal - invoice.discount;
  const balance = grandTotal - invoice.amount_paid;

  doc
    .fontSize(16)
    .fillColor('#333')
    .text('Summary', { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Subtotal: ₹${subtotal}`)
    .text(`Discount: ₹${invoice.discount}`)
    .text(`Grand Total: ₹${grandTotal}`)
    .text(`Amount Paid: ₹${invoice.amount_paid}`)
    .text(`Balance: ₹${balance}`)
    .moveDown();

  // Remarks
  if (invoice.remarks) {
    doc
      .fontSize(16)
      .fillColor('#333')
      .text('Remarks', { underline: true })
      .moveDown(0.5)
      .fontSize(12)
      .text(invoice.remarks)
      .moveDown();
  }

  // Footer
  doc
    .fontSize(12)
    .fillColor('#007BFF')
    .text('Thank you for your business!', { align: 'center' });

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => {
      const url = stream.toBlobURL('application/pdf');
      resolve(url);
    });
  });
};