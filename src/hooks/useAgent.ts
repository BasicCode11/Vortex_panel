import { useEffect, useState } from "react";
import { Agent , AgentApiResponse} from "../services/types/agent";
import { agentService } from "../services/api/agentService";

export function useAgent(): AgentApiResponse {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function fetchAgents() {
            try{
                setLoading(true);
                setError('');
                const response = await agentService.getAgents();
                setAgents(response);
            } catch {
                setError("Failed to load agents data.");
            } finally {
                setLoading(false);
            }
        }
        fetchAgents();
    } , [])
    return { agents, loading, error };
}
