import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermission';
import { LoadingSpinner } from '../common/LoadingSpinner';


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { checkPermission,  isLoading: permissionsLoading } = usePermissions();

  // Show loading while auth or permissions are loading
  if (authLoading || permissionsLoading) {
    return <LoadingSpinner wrapperClassName="min-h-screen" sizeClass="h-16 w-16" />;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user has required permission
  if (requiredPermission && !checkPermission(requiredPermission)) {
    console.warn(`Access denied: Missing permission "${requiredPermission}"`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
