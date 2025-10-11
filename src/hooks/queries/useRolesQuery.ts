import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/api/roleService';

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRole(),
    staleTime: 5 * 60 * 1000,
  });
};

export type UseRolesQueryResult = ReturnType<typeof useRolesQuery>;
