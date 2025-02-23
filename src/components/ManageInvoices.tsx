// src/components/ManageInvoices.tsx
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useReactToPrint } from 'react-to-print';
import InvoiceComponent from './InvoiceComponent';
import { InvoiceProp, ItemProp, PrintingInvoiceProp } from '@/types/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { toast } from 'sonner';
import PdfViewer from './PdfViewer';

const ManageInvoices = () => {
  const [invoices, setInvoices] = useState<InvoiceProp[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: number]: number }>({});
  const [discounts, setDiscounts] = useState<{ [key: number]: number }>({});
  const [showPaymentField, setShowPaymentField] = useState<{ [key: number]: boolean }>({});
  const [showDiscountField, setShowDiscountField] = useState<{ [key: number]: boolean }>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State for PDF URL
  const [isPdfOpen, setIsPdfOpen] = useState(false); // State for PDF viewer modal

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
  console.log('PDF URL:', pdfUrl);
  const [printingInvoice, setPrintingInvoice] = useState<PrintingInvoiceProp | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrintInvoice = async (invoiceId: number) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/print`, {
        responseType: 'blob', // Ensure the response is treated as a binary file
      });
  
      // Create a Blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
  
      // Log the blob and URL for debugging
      console.log('Blob:', blob);
      console.log('Blob URL:', url);
  
      setPdfUrl(url);
      setIsPdfOpen(true); // Open the PDF viewer
    } catch (error) {
      console.error('Error printing invoice:', error);
      toast.error('Failed to load PDF. Please try again.');
    }
  };

  const closePdfViewer = () => {
    setIsPdfOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl); // Clean up the Blob URL
      setPdfUrl(null);
    }
  };


  const handlePayBalance = async (invoiceId: number) => {
    const amount = paymentAmounts[invoiceId];
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount'); // Error toast
      return;
    }
  
    try {
      await api.post(`/invoices/${invoiceId}/pay-balance`, { amount });
      toast.success('Balance paid successfully'); // Success toast
      refreshInvoices();
    } catch (error) {
      console.error('Error paying balance:', error);
      toast.error('Failed to pay balance. Please try again.'); // Error toast
    }
  };
  
  const handleUpdateDiscount = async (invoiceId: number) => {
    const discount = discounts[invoiceId];
    if (discount === undefined || discount < 0) {
      toast.error('Please enter a valid discount'); // Error toast
      return;
    }
  
    try {
      await api.post(`/invoices/${invoiceId}/update-discount`, { discount });
      toast.success('Discount updated successfully'); // Success toast
      refreshInvoices();
    } catch (error) {
      console.error('Error updating discount:', error);
      toast.error('Failed to update discount. Please try again.'); // Error toast
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Invoices</h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-48"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-48"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Tests</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const subtotal = invoice.items.reduce((total: number, item: ItemProp) => total + item.price, 0);
            const grandTotal = subtotal - invoice.discount;
            const balance = grandTotal - invoice.amount_paid;

            return (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.patient_name}</TableCell>
                <TableCell title={invoice.items.map((item: ItemProp) => item.name).join(', ')}>
                  {truncateText(invoice.items.map((item: ItemProp) => item.name).join(', '), 30)}
                </TableCell>
                <TableCell>₹{subtotal}</TableCell>
                <TableCell>₹{invoice.discount}</TableCell>
                <TableCell>₹{grandTotal}</TableCell>
                <TableCell>₹{invoice.amount_paid}</TableCell>
                <TableCell>₹{balance}</TableCell>
                <TableCell className="flex gap-2">
                  <Button onClick={() => handlePrintInvoice(invoice.id)}>
                    Print
                  </Button>
                  {balance > 0 && (
                    <>
                      {!showPaymentField[invoice.id] ? (
                        <Button onClick={() => setShowPaymentField((prev) => ({ ...prev, [invoice.id]: true }))}>
                          Pay Balance
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={paymentAmounts[invoice.id] || ''}
                            onChange={(e) =>
                              setPaymentAmounts((prev) => ({ ...prev, [invoice.id]: parseFloat(e.target.value) }))
                            }
                            className="w-24"
                          />
                          <Button onClick={() => handlePayBalance(invoice.id)}>
                            Pay
                          </Button>
                        </div>
                      )}

                      {!showDiscountField[invoice.id] ? (
                        <Button onClick={() => setShowDiscountField((prev) => ({ ...prev, [invoice.id]: true }))}>
                          Update Discount
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={discounts[invoice.id] || ''}
                            onChange={(e) =>
                              setDiscounts((prev) => ({ ...prev, [invoice.id]: parseFloat(e.target.value) }))
                            }
                            className="w-24"
                          />
                          <Button onClick={() => handleUpdateDiscount(invoice.id)}>
                            Update
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={page === 1 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <span className="px-4">Page {page} of {totalPages}</span>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* PDF Viewer Modal */}
      {isPdfOpen && pdfUrl && (
        <PdfViewer isOpen={isPdfOpen} pdfUrl={pdfUrl} onClose={closePdfViewer} />
      )}
    </div>
  );
};

export default ManageInvoices;