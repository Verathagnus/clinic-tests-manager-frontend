import withAuth from '../components/withAuth';
import ManageItemGroups from '../components/ManageItemGroups';
import Navbar from '@/components/Navbar';

const ManageItemGroupsPage = () => {
  return (
    <div>
      <Navbar />
      <ManageItemGroups />
    </div>
  );
};

export default withAuth(ManageItemGroupsPage);