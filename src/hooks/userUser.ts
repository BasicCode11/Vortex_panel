import { useEffect, useState } from "react";
import { UserData, UserResponse } from "../services/types/user"; 
import { userService } from '../services/api/userService';

export function useUser(): UserData {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        async function fetchUser() {
            try {
                setLoading(true);
                setError(''); 
                const response = await userService.getUser();
                setUsers(response);
            } catch (e) {
                setError("Failed to load users data.");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []); 
    return { users, loading, error };
}
