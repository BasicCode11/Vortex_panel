import { agentsResponseSchema, type Agent } from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const agentService = {
  getAgent: async (): Promise<Agent[]> => {
    return fetchList<Agent[]>('/api/agents', agentsResponseSchema);
  },
};