import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Modal } from "../../components/ui/modal";
import { TrashBinIcon } from "../../icons";
import type { RoleWithPermissions } from "../../schemas/roleSchema";
import { roleService } from "../../services/api/roleService";
import { extractApiErrorMessage } from "../../utils/errorHandler";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleWithPermissions | null;
}

export const DeleteModal = ({ isOpen, onClose, role }: DeleteModalProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully!");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const apiMessage = extractApiErrorMessage(error.response?.data);
        if (apiMessage) {
          toast.error(apiMessage);
          return;
        }
      }
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Failed to delete role");
    },
  });

  const handleDelete = async () => {
    if (!role) return;
    await deleteMutation.mutateAsync(role.id);
    onClose();
  };

  if (!role) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashBinIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">Delete Role</h3>
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{role.name}</span>? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Role"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
