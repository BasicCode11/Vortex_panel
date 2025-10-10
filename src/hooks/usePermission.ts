import { useAuth } from '../context/AuthContext'; 
export const usePermissions = () => {
    const { user } = useAuth();
    const checkPermission = (requiredPermission: string): boolean => {
        if (!user) {
            return false;
        }
        return user.permissions.includes(requiredPermission);
    };

    return { checkPermission };
};
