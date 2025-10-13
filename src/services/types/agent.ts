interface Team {
  id: number;
  team_name: string;
}

interface Product {
  id: number;
  product_name: string;
}

// Define the main Agent interface
export interface Agent {
  id: number;
  agent_name: string;
  team: Team;
  products: Product;
  credit_us: number;
  credit_kh: number;
  created_at: string; 
  updated_at: string; 
}

// Define a state or API response data structure
export interface AgentApiResponse {
  agents: Agent[];
  loading: boolean;
  error: string;
}
