// src/components/InvoicePrintTemplate.tsx
import React, { forwardRef } from 'react';

interface InvoiceData {
  id: number;
  created_at: string;
  patient_name: string;
  patient_age: number;
  patient_address: string;
  patient_phone: string;
  items: Array<{ name: string; price: number }>;
  discount: number;
  amount_paid: number;
  remarks?: string;
}

export const InvoicePrintTemplate = forwardRef<HTMLDivElement, { invoice: InvoiceData }>(
  ({ invoice }, ref) => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.price, 0);
    const grandTotal = subtotal - invoice.discount;
    const balance = grandTotal - invoice.amount_paid;

    return (
      <div ref={ref} className="p-4 bg-white">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Invoice #{invoice.id}</h1>
          <p className="text-sm">Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold">Patient Details</h2>
          <p>Name: {invoice.patient_name}</p>
          <p>Age: {invoice.patient_age}</p>
          <p>Address: {invoice.patient_address}</p>
          <p>Phone: {invoice.patient_phone}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold">Tests</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-1 text-left">Test Name</th>
                <th className="border p-1 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-1">{item.name}</td>
                  <td className="border p-1 text-right">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>₹{invoice.discount}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Grand Total:</span>
            <span>₹{grandTotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span>₹{invoice.amount_paid}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Balance:</span>
            <span>₹{balance}</span>
          </div>
        </div>

        {invoice.remarks && (
          <div className="mb-4">
            <h2 className="text-lg font-bold">Remarks</h2>
            <p>{invoice.remarks}</p>
          </div>
        )}
      </div>
    );
  }
);
InvoicePrintTemplate.displayName="InvoicePrintTemplate";