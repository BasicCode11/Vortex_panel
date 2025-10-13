import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermission';
import { LoadingSpinner } from '../common/LoadingSpinner';

 type Actor = 'super-admin' | 'team-actor' | 'agent-actor';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredActor?: Actor | Actor[];
}

export const ProtectedRoute = ({ children, requiredPermission,requiredActor }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { checkPermission,isSuperAdmin, isTeamActor, isAgentActor } = usePermissions();

  if (isLoading) {
    return <LoadingSpinner wrapperClassName="min-h-screen" sizeClass="h-16 w-16" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

   const actor = (() => {
         if (!requiredActor) return true;
         const required = Array.isArray(requiredActor) ? requiredActor : [requiredActor];
         const current: Actor[] = [
           isSuperAdmin && 'super-admin',
           isTeamActor && 'team-actor',
           isAgentActor && 'agent-actor',
         ].filter(Boolean) as Actor[];
         return required.some(r => current.includes(r));
       })();

       if (!actor) return <Navigate to="/" replace />;

  return <>{children}</>;
};
