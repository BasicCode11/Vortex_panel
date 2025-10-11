import { useEffect, useState } from "react";
import { AgentData, AgentResponse } from "../services/types/agent";
import { agentService } from "../services/api/agentService";

export function useAgent(): AgentData {
    const [agents, setAgents] = useState<AgentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        async function fetchAgent() {
            try {
                setLoading(true);
                setError(''); 
                const response = await agentService.getAgent();
                setAgents(response);
            } catch (e) {
                setError("Failed to load agent data.");
            } finally {
                setLoading(false);
            }
        }
        fetchAgent();
    }, []); 
    return { agents, loading, error };
}
