import React from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthorizeRoute: React.FC = () => {
  const { isAuthenticated} = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};