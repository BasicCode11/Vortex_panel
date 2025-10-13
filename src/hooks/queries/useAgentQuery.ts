import { useQuery } from '@tanstack/react-query';
import { agentService } from '../../services/api/agentService';

export const useAgentQuery = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => agentService.getAgent(),
  });
};
export type UseAgentQueryResult = ReturnType<typeof useAgentQuery>;
