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

export interface UserResponse {
  id: number;
  username: string;
  role: Role;
  status: boolean;
  permissions: string[];
  team: Team | null;
  agents: Agent | null;
  last_active: string;
}

export interface UserData {
  users: UserResponse[];
  loading: boolean;
  error: string;
}
