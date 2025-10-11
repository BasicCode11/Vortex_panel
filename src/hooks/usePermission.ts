import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (requiredPermission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(requiredPermission);
  };


  const isSuperAdmin = user?.role?.name === "super admin";

  const isTeamActor = !!user && user.team !== null && user.agents === null;

  const isAgentActor = !!user && user.team !== null && user.agents !== null;

  return {
    checkPermission,
    isSuperAdmin,
    isTeamActor,
    isAgentActor,
  };
};
