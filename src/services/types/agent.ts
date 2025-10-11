export interface AgentResponse {
  id: number;
  agent_name: string;
}
export interface AgentData {
  agents: AgentResponse[];
  loading: boolean;
  error: string;
}
