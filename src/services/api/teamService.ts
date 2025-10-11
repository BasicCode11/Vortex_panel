import apiRequest from "./axios";
import { teamsResponseSchema, type Team } from "../../schemas/userSchema";

export const teamService = {
  getTeam: async (): Promise<Team[]> => {
    const response = await apiRequest.get('/api/teams');
    return teamsResponseSchema.parse(response.data);
  },
};