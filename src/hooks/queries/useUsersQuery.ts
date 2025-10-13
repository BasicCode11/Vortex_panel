import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api/userService';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUser(),
  });
};
export type UseUsersQueryResult = ReturnType<typeof useUsersQuery>;
