import React from 'react';
import useUserRole from '../hooks/useUserRole';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Shared/Loader/Loader';

const AdminRoute = ({ children }) => {
  const { role, isLoading } = useUserRole();
  const location = useLocation();

  if (role !== 'admin') {
    return <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-500">You do not have permission to view this page.</p>
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Go Back
      </button>
    </div>;
  }
  if (isLoading) {
    return <Loader/>;
  }
  return children;
};

export default AdminRoute;