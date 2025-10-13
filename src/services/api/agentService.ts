<<<<<<< HEAD
import { Agent } from "../types/agent";

import apiRequest from "./axios";

export const agentService = {
  getAgents: async (): Promise<Agent[]> => {
    try {
      const response = await apiRequest.get<Agent[]>("/api/agents");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      throw error; // rethrow so calling code can handle it
    }
  },
};
=======
import { agentsResponseSchema, type Agent } from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const agentService = {
  getAgent: async (): Promise<Agent[]> => {
    return fetchList<Agent[]>('/api/agents', agentsResponseSchema);
  },
};
>>>>>>> d34712e7f48cf6193139df99a1b03ec3528da5a0
