import { Modal } from "../../components/ui/modal";
import { UserResponse } from "../../services/types/user";
import { CustomSelect, SelectOption } from "../../components/form/CustomSelect";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

// Mock data - Replace with actual data from API
const roleOptions: SelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "team_actor", label: "Team Actor" },
  { value: "agent", label: "Agent" },
];

const teamOptions: SelectOption[] = [
  { value: "1", label: "Sales Team" },
  { value: "2", label: "Support Team" },
  { value: "3", label: "Marketing Team" },
];

const agentOptions: SelectOption[] = [
  { value: "1", label: "Agent John" },
  { value: "2", label: "Agent Sarah" },
  { value: "3", label: "Agent Mike" },
];

export const EditModal = ({ isOpen, onClose, user }: EditModalProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Update user submitted:', user?.id, data);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit User
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update user information
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* User ID Badge */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  #{user.id}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Current Role</p>
              <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                {user.role.name}
              </span>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="mb-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Account Information
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  defaultValue={user.username}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Leave blank to keep current"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to keep current password
                </p>
              </div>
            </div>
          </div>

          {/* Role & Assignments Section */}
          <div className="mb-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role & Assignments
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CustomSelect
                label="Role"
                name="role"
                placeholder="Select role"
                options={roleOptions}
                defaultValue={user.role.name}
                required
              />

              <CustomSelect
                label="Team"
                name="team"
                placeholder="No team"
                options={teamOptions}
                defaultValue={user.team?.id.toString() || ""}
              />

              <CustomSelect
                label="Agent"
                name="agent"
                placeholder="No agent"
                options={agentOptions}
                defaultValue={user.agents?.id.toString() || ""}
              />
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Account Status
            </h4>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  defaultChecked={user.status}
                  className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  defaultChecked={!user.status}
                  className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
