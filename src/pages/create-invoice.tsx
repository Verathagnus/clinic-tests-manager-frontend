"use client"
import { useState, useEffect } from 'react';
import api from '../utils/api';
// import { useReactToPrint } from 'react-to-print';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import InvoiceComponent from '@/components/InvoiceComponent';
import { ItemGroupProp, ItemProp } from '@/types/types';
import { toast } from 'sonner';
import PdfViewer from '@/components/PdfViewer';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';

const CreateInvoice = () => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>();
  const [patientAddress, setPatientAddress] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [items, setItems] = useState<{ id: number, price: number, name: string, description: string, group_id?: number }[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItemProp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [remarks, setRemarks] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State for PDF URL
  const [isPdfOpen, setIsPdfOpen] = useState(false); // State for PDF viewer modal
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // State for selected group filter
  const [itemGroups, setItemGroups] = useState<ItemGroupProp[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get('/items');
      setItems(response.data);
    };

    const fetchItemGroups = async () => {
      const response = await api.get('/item-groups');
      setItemGroups(response.data);
    };

    fetchItems();
    fetchItemGroups();
  }, []);

  const handleAddItem = (item: ItemProp) => {
    if (!selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      setSelectedItems((prevSelectedItems) => [...prevSelectedItems, item]);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item.id !== itemId)
    );
    setDiscount(0);
    setAmountPaid(0);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null);

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

  const handleCreateInvoice = async () => {
    try {
      const response = await api.post('/invoices', {
        patient: {
          name: patientName,
          age: parseInt(patientAge + ""),
          address: patientAddress,
          phone: patientPhone,
        },
        items: selectedItems.map((item) => ({ id: item.id, price: item.price })),
        discount,
        amountPaid,
        remarks,
      });
      toast.success('Invoice created successfully');

      setCurrentInvoiceId(response.data.id);
      setIsSubmitted(true);
      handlePrintInvoice(response.data.id)
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error creating invoice');

    }
  };

  const handleNewInvoice = () => {
    setPatientName('');
    setPatientAge(undefined);
    setPatientAddress('');
    setPatientPhone('');
    setSelectedItems([]);
    setDiscount(0);
    setAmountPaid(0);
    setRemarks('');
    setIsSubmitted(false);
    setCurrentInvoiceId(null);
  };

  const subtotal = selectedItems.reduce((total, item) => total + parseFloat(item.price + ""), 0);
  const grandTotal = subtotal - discount;
  const balanceAmount = grandTotal - amountPaid;

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroupId ? item.group_id === selectedGroupId : true;
    return matchesSearch && matchesGroup;
  });

  // Discount validation
  const handleDiscountChange = (value: number) => {
    if (value <= subtotal) {
      setDiscount(value);
    } else {
      toast.error('Discount cannot be greater than subtotal.');
    }
  };

  // Amount paid validation
  const handleAmountPaidChange = (value: number) => {
    if (value <= grandTotal) {
      setAmountPaid(value);
    } else {
      toast.error('Amount paid cannot be greater than grand total.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-gray-100 ">
        {isPdfOpen && pdfUrl && (
          <PdfViewer isOpen={isPdfOpen} pdfUrl={pdfUrl} onClose={closePdfViewer} />
        )}

        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold ">Create Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            {isSubmitted && (
              <div className="flex gap-4 mb-6">
                <Button
                  onClick={() => { if (currentInvoiceId) handlePrintInvoice(currentInvoiceId) }}
                  variant="default"
                  className="  text-white"
                >
                  Print Invoice
                </Button>
                <Button
                  onClick={handleNewInvoice}
                  variant="secondary"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Create New Invoice
                </Button>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Patient Details</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-600">Name<span className="text-red-800"> *</span></Label>
                    <Input
                      id="name"
                      placeholder="Patient Name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="age" className="text-gray-600">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Age"
                      value={patientAge}
                      onChange={(e) => { if (e.target.value === '' || /^[0-9\b]+$/.test(e.target.value)) { setPatientAge(parseInt(e.target.value)) } }}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="text-gray-600">Address</Label>
                    <Input
                      id="address"
                      placeholder="Address"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-gray-600">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Phone Number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Select Items Section */}
              {!isSubmitted && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Select Items</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="search" className="text-gray-600">Search Items</Label>
                      <Input
                        id="search"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="group" className="text-gray-600">Filter by Group</Label>
                      <select
                        id="group"
                        value={selectedGroupId || ""}
                        onChange={(e) => setSelectedGroupId(Number(e.target.value) || null)}
                        className="p-2 border rounded w-48"
                      >
                        <option value="">All Groups</option>
                        {itemGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Table className="border rounded-lg shadow-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700">Name</TableHead>
                          <TableHead className="text-gray-700">Description</TableHead>
                          <TableHead className="text-right text-gray-700">Price</TableHead>
                          <TableHead className="text-right text-gray-700">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="text-gray-600">{item.name}</TableCell>
                            <TableCell className="text-gray-600">{item.description}</TableCell>
                            <TableCell className="text-right text-gray-600">₹{item.price}</TableCell>
                            <TableCell className="text-right">
                              {!selectedItems.some((selectedItem) => selectedItem.id === item.id) && (
                                <Button
                                  onClick={() => handleAddItem(item)}
                                  variant="secondary"
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Add
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Selected Items</h3>
                <Table className="border rounded-lg shadow-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-700">Name</TableHead>
                      <TableHead className="text-gray-700">Description</TableHead>
                      <TableHead className="text-right text-gray-700">Price</TableHead>
                      {!isSubmitted && (
                        <TableHead className="text-right text-gray-700">Action</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-gray-600">{item.name}</TableCell>
                        <TableCell className="text-gray-600">{item.description}</TableCell>
                        <TableCell className="text-right text-gray-600">₹{item.price}</TableCell>
                        {!isSubmitted && (
                          <TableCell className="text-right">
                            <Button
                              onClick={() => handleRemoveItem(item.id!)}
                              variant="default"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Details</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2 text-primary font-bold">
                    <Label htmlFor="discount" className="text-primary font-bold">Subtotal:</Label>
                    <Input
                      id="subtotal"
                      type="number"
                      placeholder="Subtotal"
                      value={subtotal}
                      readOnly={true}
                      disabled={true}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2 text-blue-700 font-bold">
                    <Label htmlFor="discount" className="text-blue-700 font-bold">Discount</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="Discount"
                      value={discount}
                      onChange={(e) => handleDiscountChange(Number(e.target.value))}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2 text-primary font-bold">
                    <Label htmlFor="grandTotal" className="text-primary font-bold">Grand Total (after discount):</Label>
                    <Input
                      id="grandTotal"
                      type="number"
                      placeholder="GrandTotal"
                      value={grandTotal}
                      readOnly={true}
                      disabled={true}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2 font-bold">
                    <Label htmlFor="amountPaid" className="text-gray-600 font-bold">Amount Paid</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      placeholder="Amount Paid"
                      value={amountPaid}
                      onChange={(e) => handleAmountPaidChange(Number(e.target.value))}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2 text-blue-700 font-bold">
                    <Label htmlFor="balanceAmount" className="text-blue-700 font-bold">Balance Amount:</Label>
                    <Input
                      id="balanceAmount"
                      type="number"
                      placeholder="Balance Amount"
                      value={balanceAmount}
                      disabled={true}
                      readOnly={true}
                      className="border-gray-300  "
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="remarks" className="text-gray-600">Remarks</Label>
                    <Input
                      id="remarks"
                      placeholder="Remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      disabled={isSubmitted}
                      className="border-gray-300  "
                    />
                  </div>
                </div>
              </div>
            </div>

            {!isSubmitted && (
              <Button
                onClick={handleCreateInvoice}
                className="mt-6 w-full  text-white"
                size="lg"
                variant="default"
                disabled={selectedItems.length === 0 || patientName.length === 0} // Disable if no items are selected
              >
                Submit Invoice
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(CreateInvoice);