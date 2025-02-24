import withAuth from '../components/withAuth';
import ManageItems from '../components/ManageItems';
import Navbar from '@/components/Navbar';

const ManageItemsPage = () => {
  return (
    <div>
      <Navbar />
      <ManageItems />
    </div>
  );
};

export default withAuth(ManageItemsPage);