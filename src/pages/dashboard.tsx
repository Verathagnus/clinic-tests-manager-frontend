// src/pages/dashboard.tsx
import withAuth from '../components/withAuth';
import ManageItems from '../components/ManageItems';
import ManageItemGroups from '../components/ManageItemGroups';
import ManagePatients from '../components/ManagePatients';
import ManageInvoices from '../components/ManageInvoices';

const DashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <ManageItemGroups />
      <ManageItems />
      <ManagePatients />
      <ManageInvoices />
    </div>
  );
};

export default withAuth(DashboardPage);