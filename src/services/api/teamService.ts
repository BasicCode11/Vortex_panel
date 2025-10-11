import { Team } from "../types/user";
import apiRequest from "./axios";

export const teamService = {
    getAgent : async() : Promise<Team[]> => {
        const response = await apiRequest.get<Team[]>('/api/agents');
        return response.data;
    }
}