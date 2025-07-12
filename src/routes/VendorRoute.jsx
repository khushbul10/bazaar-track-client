import React from 'react';
import useUserRole from '../hooks/useUserRole';

const VendorRoute = ({ children }) => {
  const { role } = useUserRole();
  console.log('User role:', role);

  // Check if the user is a vendor
  if (role !== 'vendor') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  return children;
};

export default VendorRoute;