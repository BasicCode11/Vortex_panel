import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/api/roleService';

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getRole(),
  });
};

export type UseRolesQueryResult = ReturnType<typeof useRolesQuery>;
