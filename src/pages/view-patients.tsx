import withAuth from '../components/withAuth';
import ManagePatients from '../components/ManagePatients';
import Navbar from '@/components/Navbar';

const ViewPatientsPage = () => {
  return (
    <div>
      <Navbar />
      <ManagePatients />
    </div>
  );
};

export default withAuth(ViewPatientsPage);