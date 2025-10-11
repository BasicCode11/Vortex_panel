import apiRequest from "./axios";
import { agentsResponseSchema, type Agent } from "../../schemas/userSchema";

export const agentService = {
  getAgent: async (): Promise<Agent[]> => {
    const response = await apiRequest.get('/api/agents');
    return agentsResponseSchema.parse(response.data);
  },
};