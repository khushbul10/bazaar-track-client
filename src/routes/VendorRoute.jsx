import React from 'react';
import useUserRole from '../hooks/useUserRole';
import Loader from '../Shared/Loader/Loader';
import { Navigate, useLocation } from 'react-router';

const VendorRoute = ({ children }) => {
  const { role, isLoading } = useUserRole();
  const location = useLocation();

  // Check if the user is a vendor
  if (role !== 'vendor' && role !== 'admin') {
    return <Navigate to="/login" state={{ from: location}} replace ></Navigate>;
  }
  if(isLoading) {
    return <Loader/>;
  }

  return children;
};

export default VendorRoute;