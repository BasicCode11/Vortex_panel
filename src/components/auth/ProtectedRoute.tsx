import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermission';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkPermission } = usePermissions();

  if (isLoading) {
    return <LoadingSpinner wrapperClassName="min-h-screen" sizeClass="h-16 w-16" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
