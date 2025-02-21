// src/components/ManageInvoices.tsx
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import InvoicePrinter from './InvoicePrinter';
import { useReactToPrint } from 'react-to-print';
import InvoiceComponent from './InvoiceComponent';

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: number]: number }>({});
  const [discounts, setDiscounts] = useState<{ [key: number]: number }>({});
  const [showPaymentField, setShowPaymentField] = useState<{ [key: number]: boolean }>({});
  const [showDiscountField, setShowDiscountField] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const fetchInvoices = async () => {
      const response = await api.get('/invoices', {
        params: { page, startDate, endDate },
      });
      setInvoices(response.data.invoices);
      setTotalPages(response.data.totalPages);
      setTotalInvoices(response.data.totalInvoices);
    };
    fetchInvoices();
  }, [page, startDate, endDate]);

  const [printingInvoice, setPrintingInvoice] = useState<any>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  console.log(printingInvoice)
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${printingInvoice?.id}`,
    onAfterPrint: () => {
      setPrintingInvoice(null);
    },
    pageStyle: `
      @page {
        size: A5;
        margin: 10mm;
      }
    `,
    contentRef: componentRef,
  });

  console.log(printingInvoice)
  const handlePrintInvoice = async (invoiceId: number) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/print-details`);
      setPrintingInvoice(response.data);
      setTimeout(handlePrint, 100);
    } catch (error) {
      console.error('Error printing invoice:', error);
    }
  };


  const handlePayBalance = async (invoiceId: number) => {
    const amount = paymentAmounts[invoiceId];
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await api.post(`/invoices/${invoiceId}/pay-balance`, { amount });
      alert('Balance paid successfully');
      refreshInvoices();
    } catch (error) {
      console.error('Error paying balance:', error);
    }
  };

  const handleUpdateDiscount = async (invoiceId: number) => {
    const discount = discounts[invoiceId];
    if (discount === undefined || discount < 0) {
      alert('Please enter a valid discount');
      return;
    }

    try {
      await api.post(`/invoices/${invoiceId}/update-discount`, { discount });
      alert('Discount updated successfully');
      refreshInvoices();
    } catch (error) {
      console.error('Error updating discount:', error);
    }
  };

  const refreshInvoices = async () => {
    const response = await api.get('/invoices', {
      params: { page, startDate, endDate },
    });
    setInvoices(response.data.invoices);
    setTotalPages(response.data.totalPages);
    setTotalInvoices(response.data.totalInvoices);
    setPaymentAmounts({});
    setDiscounts({});
    setShowPaymentField({});
    setShowDiscountField({});
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Invoices</h2>
      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 border rounded mr-2">
          Previous
        </button>
        <span className="p-2">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="p-2 border rounded">
          Next
        </button>
        <p>Total Items: {totalInvoices}</p>
      </div>
      <ul>
        {invoices.map((invoice) => {
          const subtotal = invoice.items.reduce((total: number, item: any) => total + item.price, 0);
          const grandTotal = subtotal - invoice.discount;
          const balance = grandTotal - invoice.amount_paid;

          return (
            <li key={invoice.id} className="mb-2">
              <p>Invoice #{invoice.id}</p>
              <p>Patient: {invoice.patient_name}</p>
              <p>Tests: {invoice.items.map((item: any) => item.name).join(', ')}</p>
              <p>Subtotal: ₹{subtotal}</p>
              <p>Discount: ₹{invoice.discount}</p>
              <p>Grand Total: ₹{grandTotal}</p>
              <p>Amount Paid: ₹{invoice.amount_paid}</p>
              <p>Balance: ₹{balance}</p>

              {/* Print Invoice button is always shown */}
              <button
                onClick={() => handlePrintInvoice(invoice.id)}
                className="bg-blue-500 text-white p-1 rounded mr-2"
              >
                Print Invoice
              </button>

              {/* Only show Pay Balance and Update Discount if there is a balance */}
              {balance > 0 && (
                <>
                  {!showPaymentField[invoice.id] ? (
                    <button
                      onClick={() => setShowPaymentField((prev) => ({ ...prev, [invoice.id]: true }))}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      Pay Balance
                    </button>
                  ) : (
                    <div className="mt-2">
                      <label className="block">Pay Balance</label>
                      <input
                        type="number"
                        value={paymentAmounts[invoice.id] || ''}
                        onChange={(e) =>
                          setPaymentAmounts((prev) => ({ ...prev, [invoice.id]: parseFloat(e.target.value) }))
                        }
                        className="p-2 border rounded mr-2"
                      />
                      <button
                        onClick={() => handlePayBalance(invoice.id)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        Pay
                      </button>
                    </div>
                  )}

                  {!showDiscountField[invoice.id] ? (
                    <button
                      onClick={() => setShowDiscountField((prev) => ({ ...prev, [invoice.id]: true }))}
                      className="bg-yellow-500 text-white p-1 rounded ml-2"
                    >
                      Update Discount
                    </button>
                  ) : (
                    <div className="mt-2">
                      <label className="block">Update Discount</label>
                      <input
                        type="number"
                        value={discounts[invoice.id] || ''}
                        onChange={(e) =>
                          setDiscounts((prev) => ({ ...prev, [invoice.id]: parseFloat(e.target.value) }))
                        }
                        className="p-2 border rounded mr-2"
                      />
                      <button
                        onClick={() => handleUpdateDiscount(invoice.id)}
                        className="bg-yellow-500 text-white p-1 rounded"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
      {/* Print Template */}
      <div style={{ display: "none" }}>
        {printingInvoice && (
          <div ref={componentRef}>
            <InvoiceComponent invoice={printingInvoice} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInvoices;