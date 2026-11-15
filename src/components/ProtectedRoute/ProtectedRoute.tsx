import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/stock';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and current role doesn't match, redirect to own role's view
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'despachador' ? '/despachador' : '/balanza'} replace />;
  }

  return <>{children}</>;
}
