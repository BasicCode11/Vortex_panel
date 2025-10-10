export interface UserRead {
  id: number;
  username: string;
  role_id?: number;
  status: string;
  permissions?: string[];
  team_id: string;
  agent_id: string;
}