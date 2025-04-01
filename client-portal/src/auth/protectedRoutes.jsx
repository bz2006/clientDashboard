import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './isAuth';


const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
