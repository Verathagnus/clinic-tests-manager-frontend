// src/pages/dashboard.tsx
import Navbar from '../components/Navbar';
import withAuth from '../components/withAuth';
import { Gift } from 'lucide-react';

const DashboardPage = () => {
  const cards = [
    {
      title: 'Manage Item Groups',
      description: 'View and update your item groups.',
      linkText: 'Go to Item Groups',
      linkUrl: '/manage-item-groups',
    },
    {
      title: 'Manage Items',
      description: 'View and edit your inventory items.',
      linkText: 'Go to Items',
      linkUrl: '/manage-items',
    },
    {
      title: 'View Patients',
      description: 'Access patient information.',
      linkText: 'Go to Patients',
      linkUrl: '/view-patients',
    },
    {
      title: 'Manage Invoices',
      description: 'Manage created invoices, pay balances, update discount.',
      linkText: 'Go to Invoices',
      linkUrl: '/manage-invoices',
    },
    {
      title: 'Create New Invoice',
      description: 'Create new invoices for your patients.',
      linkText: 'Go to Create Invoice',
      linkUrl: '/create-invoice',
    },
    {
      title: 'Utilities',
      description: 'Backup, restore, and generate reports.',
      linkText: 'Go to Utilities',
      linkUrl: '/utilities',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, index) => (
            <div key={index} className=" p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Gift className="h-6 w-6 mr-2" />
                <h2 className="text-lg font-bold">{card.title}</h2>
              </div>
              <p className="mb-2">{card.description}</p>
              <a href={card.linkUrl} className="text-primary hover:underline">
                {card.linkText} <span aria-hidden="true">↗</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardPage);