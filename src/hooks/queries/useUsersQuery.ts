import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api/userService';

// Query hook for fetching users
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUser(),
    staleTime: 5 * 60 * 1000, 
  });
};
export type UseUsersQueryResult = ReturnType<typeof useUsersQuery>;
