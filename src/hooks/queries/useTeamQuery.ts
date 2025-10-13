import { useQuery } from '@tanstack/react-query';
import { teamService } from '../../services/api/teamService';

export const useTeamQuery = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeam(),
  });
};

export type UseTeamQueryResult = ReturnType<typeof useTeamQuery>;
