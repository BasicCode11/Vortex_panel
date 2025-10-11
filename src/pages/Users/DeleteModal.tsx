import { Modal } from "../../components/ui/modal";
import { TrashBinIcon } from "../../icons";
import { UserResponse } from "../../services/types/user";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export const DeleteModal = ({ isOpen, onClose, user }: DeleteModalProps) => {
  const handleDelete = () => {
    // Handle delete logic
    console.log('Delete user:', user?.id);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TrashBinIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h3 className="text-center text-lg font-semibold text-gray-900 dark:text-white">
          Delete User
        </h3>
        
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{user.username}</span>? 
          This action cannot be undone.
        </p>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Role:</span>
            <span className="font-medium text-gray-900 dark:text-white">{user.role.name}</span>
          </div>
          {user.team && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Team:</span>
              <span className="font-medium text-gray-900 dark:text-white">{user.team.team_name}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </Modal>
  );
};
