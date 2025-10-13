import { teamsResponseSchema, type Team } from "../../schemas/userSchema";
import { fetchList } from "./fetchList";

export const teamService = {
  getTeam: async (): Promise<Team[]> => {
    return fetchList<Team[]>('/api/teams', teamsResponseSchema);
  },
};