import { useQuery } from '@tanstack/react-query';
import { agentService } from '../../services/api/agentService';

// Query hook for fetching users
export const useAgentQuery = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => agentService.getAgent(),
    staleTime: 5 * 60 * 1000, 
  });
};
export type UseAgentQueryResult = ReturnType<typeof useAgentQuery>;
