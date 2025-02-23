// src/components/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const router = useRouter();
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};


export default withAuth;