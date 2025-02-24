// src/pages/utilities.tsx
import withAuth from '@/components/withAuth';
import UtilityComponent from '@/components/UtilityComponent';
import Navbar from '@/components/Navbar';

const UtilitiesPage = () => {
  return (
    <div>
      <Navbar />
      <UtilityComponent />
    </div>
  );
};

export default withAuth(UtilitiesPage);