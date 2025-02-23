"use client"
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useReactToPrint } from 'react-to-print';
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
import InvoiceComponent from '@/components/InvoiceComponent';
import { ItemProp } from '@/types/types';
import { toast } from 'sonner';

const CreateInvoice = () => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>();
  const [patientAddress, setPatientAddress] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [items, setItems] = useState<{ id: number, price: number, name: string, description: string }[]>([]);
  const [selectedItems, setSelectedItems] = useState<ItemProp[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get('/items');
      setItems(response.data);
    };
    fetchItems();
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
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<number | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `Invoice-${currentInvoiceId}`,
    contentRef: componentRef,
    pageStyle: `
      @page {
        size: A5;
        margin: 10mm;
      }
    `,
  });

  const handleCreateInvoice = async () => {
    try {
      const response = await api.post('/invoices', {
        patient: {
          name: patientName,
          age: parseInt(patientAge+""),
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
      handlePrint();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.success('Error creating invoice');

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

  const subtotal = selectedItems.reduce((total, item) => total + parseFloat(item.price+""), 0);
  const grandTotal = subtotal - discount;
  const balanceAmount = grandTotal - amountPaid;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-gray-100 ">
      <div style={{ display: "none" }}>
        
      </div>
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold ">Create Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          {isSubmitted && (
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => handlePrint()}
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
                    onChange={(e) => {if (e.target.value === '' ||  /^[0-9\b]+$/.test(e.target.value)) {setPatientAge(parseInt(e.target.value))}}}
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
                      className="border-gray-300  "
                    />
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
                      {items
                        .filter((item) =>
                          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((item) => (
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
              <div className="mt-4 space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grand Total (after discount):</span>
                  <span>₹{grandTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-700">
                  <span>Balance Amount:</span>
                  <span>₹{balanceAmount}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Details</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discount" className="text-gray-600">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="Discount"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    disabled={isSubmitted}
                    className="border-gray-300  "
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amountPaid" className="text-gray-600">Amount Paid</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    placeholder="Amount Paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    disabled={isSubmitted}
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
  );
};

export default CreateInvoice;