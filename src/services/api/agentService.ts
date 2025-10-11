
import { Agent } from "../types/user";
import apiRequest from "./axios";

export const agentService = {
    getAgent : async() : Promise<Agent[]> => {
        const response = await apiRequest.get<Agent[]>('/api/agents');
        return response.data;
    }
}