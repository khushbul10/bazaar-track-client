import React from 'react';
import useUserRole from '../hooks/useUserRole';

const AdminRoute = ({ children }) => {
  const { role } = useUserRole();

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }
  return children;
};

export default AdminRoute;