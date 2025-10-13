import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../components/ui/modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Checkbox from "../../components/form/input/Checkbox";
import { roleService } from "../../services/api/roleService";
import type { Permission } from "../../schemas/roleSchema";

type Action = "read" | "create" | "update" | "delete";
const ACTIONS: Action[] = ["read", "create", "update", "delete"];

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, roleId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => roleId != null ? roleService.getRoleById(roleId) : Promise.reject("no-id"),
    enabled: isOpen && roleId != null,
  });

  const permissionMatrix = useMemo(() => {
    if (!data) return [] as Array<{ resource: string; actions: Partial<Record<Action, Permission>> }>;
    const map = new Map<string, Partial<Record<Action, Permission>>>();
    data.permissions.forEach((p) => {
      const [resource, action] = p.name.split(":") as [string, Action | undefined];
      const key = (resource || p.name).toLowerCase();
      if (!map.has(key)) map.set(key, {});
      if (action && ACTIONS.includes(action)) {
        map.get(key)![action] = p;
      }
    });
    return Array.from(map.entries()).map(([resource, actions]) => ({ resource, actions }));
  }, [data]);

  // List of permission group columns
  const resources = useMemo(() => permissionMatrix.map(p => p.resource), [permissionMatrix]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Role Permissions</h3>
          {data && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {data.name} {data.description ? `– ${data.description}` : ""}
            </p>
          )}
        </div>

        {isLoading && <LoadingSpinner label="Loading role..." />}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Failed to load role
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.05] text-gray-500 dark:text-gray-400">
                  <th className="px-3 py-2">Action</th>
                  {resources.map((res) => (
                    <th key={res} className="px-3 py-2 capitalize">{res.replace(/-/g, " ")}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {ACTIONS.map((a) => (
                  <tr key={a}>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-white/90 capitalize">{a}</td>
                    {resources.map((res) => {
                      const actions = permissionMatrix.find(p => p.resource === res)?.actions || {};
                      const checked = !!actions[a as keyof typeof actions];
                      return (
                        <td key={res} className="px-3 py-2">
                          <Checkbox checked={checked} onChange={() => {}} disabled className="w-4 h-4" />
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-400" colSpan={5}>No permissions</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewModal;

