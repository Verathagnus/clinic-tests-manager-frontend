// app/page.tsx
import CreateInvoice from '../pages/create-invoice';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <CreateInvoice />
    </div>
  );
}