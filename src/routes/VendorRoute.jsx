import React from 'react';
import useUserRole from '../hooks/useUserRole';
import Loader from '../Shared/Loader/Loader';
import { Navigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';

const VendorRoute = ({ children }) => {
  const { role, isLoading } = useUserRole();

  // Check if the user is a vendor
  if (role !== 'vendor' && role !== 'admin') {
    toast.error("Access Denied: You do not have permission to view this page.");
    return <Navigate to="/login" ></Navigate>;
  }
  if(isLoading) {
    return <Loader/>;
  }

  return children;
};

export default VendorRoute;