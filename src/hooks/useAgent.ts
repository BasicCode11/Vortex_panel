import { useEffect, useState } from "react";
import { AgentData, AgentResponse } from "../services/types/agent";
import { agentService } from "../services/api/agentService";

export function useUser(): AgentData {
    const [agents, setAgents] = useState<AgentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                setError(''); 
                const response = await agentService.getAgent();
                setAgents(response);
            } catch (e) {
                setError("Failed to load users data.");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []); 
    return { agents, loading, error };
}
