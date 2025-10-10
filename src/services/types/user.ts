export interface Role {
    id: number;
    name: string;
}
export interface Team {
    id: number;
    team_name: string;
}
export interface Agent {
    id: number;
    agent_name: string;
}
export interface UserRead {
  id: number;
  username: string;
  role:Role;
  status: string;
  permissions?: string[];
   team: Team | null; 
    agent: Agent | null;
}