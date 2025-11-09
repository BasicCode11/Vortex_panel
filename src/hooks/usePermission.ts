import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { roleService } from '../services/api/roleService';

export const usePermissions = () => {
  const { user } = useAuth();

  // Fetch the full role details with permissions if user has a role
  const { data: roleWithPermissions } = useQuery({
    queryKey: ['role', user?.role_id],
    queryFn: () => roleService.getRoleById(user?.role_id),
    enabled: !!user?.role_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract permission names from the role
  const userPermissions = useMemo(() => {
    if (!roleWithPermissions?.permissions) {
      return [];
    }
    return roleWithPermissions.permissions.map(p => p.name);
  }, [roleWithPermissions]);

  const checkPermission = (requiredPermission: string): boolean => {
    if (!user || !user.role_id) {
      return false;
    }
    return userPermissions.includes(requiredPermission);
  };


  return {
    checkPermission,
    permissions: userPermissions,
    role: user?.role_id,
    isLoading: !roleWithPermissions && !!user?.role_id,
  };
};
