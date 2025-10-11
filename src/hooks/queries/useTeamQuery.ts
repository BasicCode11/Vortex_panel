import { useQuery } from '@tanstack/react-query';
import { teamService } from '../../services/api/teamService';

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeam(),
    staleTime: 5 * 60 * 1000,
  });
};

export type UseTeamQueryResult = ReturnType<typeof useTeamQuery>;
