import React from 'react';
import { Phone, MapPin } from 'lucide-react';
const InvoiceComponent = ({ invoice }) => {
  const subtotal = invoice.items.reduce((total, item) => total + item.price, 0);
  const grandTotal = subtotal - invoice.discount;
  const balance = grandTotal - invoice.amount_paid;

  return (
    <div className="max-w-2xl mx-auto p-4 border border-gray-300">
      <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Shreebhumi Diagnostics</h1>
          <div className="flex flex-col gap-1 text-sm">
            <p className="flex gap-1 text-sm"><MapPin className="text-[#531ea5]" /> ASdas das, AWSDasd asdasdas </p>
            <p className="flex gap-1"><Phone className="text-[#531ea5]" />1111111111:</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Invoice</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">

        <div>
          <h3 className="font-bold text-[#531ea5]">Customer Details</h3>
          <p><span className="text-[#531ea5]">Name: </span>{invoice.patient_name}</p>
          <p><span className="text-[#531ea5]">Address: </span>{invoice.patient_address}</p>
          <p><span className="text-[#531ea5]">Contact Number: </span>{invoice.patient_phone}</p>
        </div>
        <div>
          <h3 className="font-bold text-[#531ea5]">Bill Details</h3>
          <p><span className="text-[#531ea5]">Bill No.: </span>{invoice.id}</p>
          <p><span className="text-[#531ea5]">Date: </span>{new Date(invoice.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-4">
        <thead style={{ backgroundColor: "#531ea5" }}>
          <tr className=" justify-items-start">
            <th className="border border-gray-300 p-2 text-white">Test Name</th>
            <th className="border border-gray-300 p-2 text-white">Description</th>
            <th className="border border-gray-300 p-2 text-white">Price</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2">{item.description}</td>
              <td className="border border-gray-300 p-2 text-right">₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-gray-300 pt-4 mb-4">
        <div className="flex flex-row-reverse gap-1">
          <span>₹{subtotal}</span>
          <span>Subtotal:</span>
        </div>
        <div className="flex  flex-row-reverse gap-1">
          <span>₹{invoice.discount}</span>
          <span>Discount:</span>
        </div>
        <div className="flex  flex-row-reverse gap-1 font-bold">
          <span>₹{grandTotal}</span>
          <span>Grand Total:</span>
        </div>
        <div className="flex  flex-row-reverse gap-1">
          <span>₹{invoice.amount_paid}</span>
          <span>Amount Paid:</span>
        </div>
        <div className="flex  flex-row-reverse gap-1 font-bold">
          <span>₹{balance}</span>
          <span>Balance:</span>
        </div>
      </div>

      {invoice.remarks && (
        <div className="mb-4">
          <h2 className="font-bold">Remarks</h2>
          <p>{invoice.remarks}</p>
        </div>
      )}

      <div className="text-center border-t-2 border-gray-300 pt-4">
        <p>Thanks for business with us! Please visit us again!</p>
      </div>
    </div>
  );
};

export default InvoiceComponent;