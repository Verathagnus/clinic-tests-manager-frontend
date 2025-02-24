import withAuth from '../components/withAuth';
import ManageInvoices from '../components/ManageInvoices';
import Navbar from '@/components/Navbar';

const ManageInvoicesPage = () => {
  return (
    <div>
      <Navbar />
      <ManageInvoices />
    </div>
  );
};

export default withAuth(ManageInvoicesPage);