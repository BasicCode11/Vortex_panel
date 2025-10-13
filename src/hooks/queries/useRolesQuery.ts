import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/api/roleService';

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRole(),
  });
};

export const useRolesPermissionQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRolePermission(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
};

export const usePermissionQuery = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => roleService.getPermission(),
  });
};

export type UseRolesQueryResult = ReturnType<typeof useRolesQuery>;
export type UseRolesPermissionQueryResult = ReturnType<typeof useRolesPermissionQuery>;
export type UsePermissionQueryResult = ReturnType<typeof usePermissionQuery>;
