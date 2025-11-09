import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/api/userService';

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUser(),
  });

};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getprofile()
  })
}

export type useUserProfileQueryResult = ReturnType<typeof useUserProfileQuery>;
export type UseUsersQueryResult = ReturnType<typeof useUsersQuery>;
