// src/pages/InvoicePage.tsx
import React from 'react';
import InvoiceComponent from '../components/InvoiceComponent';
import { describe } from 'node:test';

const InvoicePage = () => {
  const sampleInvoice = {
    id: 123,
    patient_name: 'John Doe',
    patient_age: 30,
    patient_address: '123 Main St, Anytown',
    patient_phone: '555-555-5555',
    created_at: new Date().toISOString(),
    items: [
      { name: 'Blood Test', price: 50, description: "Test sets sest"},
      { name: 'X-ray', price: 100, description: "Test sets sest" },
      { name: 'MRI', price: 200, description: "Test sets sest" },
    ],
    discount: 20,
    amount_paid: 150,
    remarks: 'Please follow up in two weeks.',
  };

  return (
    <div className="p-6">
      <InvoiceComponent invoice={sampleInvoice} />
    </div>
  );
};

export default InvoicePage;