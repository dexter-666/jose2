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
    const roleParam = requiredRole ? `?role=${requiredRole}` : '';
    return <Navigate to={`/login${roleParam}`} state={{ from: location }} replace />;
  }

  // If a specific role is required and current role doesn't match, require login for that role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/login?role=${requiredRole}`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
