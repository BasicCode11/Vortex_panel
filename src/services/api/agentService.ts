
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
