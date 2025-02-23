// src/components/InvoiceDetails.tsx
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { EditProp } from '@/types/types';

const InvoiceDetails = ({ invoiceId }: { invoiceId: number }) => {
  const [edits, setEdits] = useState<EditProp[]>([]);

  useEffect(() => {
    const fetchEdits = async () => {
      const response = await api.get(`/edits/invoices/${invoiceId}`);
      setEdits(response.data);
    };
    fetchEdits();
  }, [invoiceId]);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Edits</h3>
      <ul>
        {edits.map((edit) => (
          <li key={edit.id} className="mb-2">
            Edited on: {new Date(edit.created_at).toLocaleString()} - Changes: {JSON.stringify(edit.after)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceDetails;