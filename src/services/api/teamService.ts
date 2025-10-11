import { Team } from "../types/user";
import apiRequest from "./axios";

export const teamService = {
    getTeam : async() : Promise<Team[]> => {
        const response = await apiRequest.get<Team[]>('/api/teams');
        return response.data;
    }
}