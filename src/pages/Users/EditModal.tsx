import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Modal } from "../../components/ui/modal";
import { 
  type UserResponse, 
  updateUserSchema, 
  type UpdateUserFormData
} from "../../schemas/userSchema";
import { CustomSelect, SelectOption } from "../../components/form/CustomSelect";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useTeamQuery } from "../../hooks/queries/useTeamQuery";
import { useAgentQuery } from "../../hooks/queries/useAgentQuery";
import { useRolesQuery } from "../../hooks/queries/useRolesQuery";
import { usePermissions } from "../../hooks/usePermission";
import { userService } from "../../services/api/userService";
import { extractApiErrorMessage } from "../../utils/errorHandler";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export const EditModal = ({ isOpen, onClose, user }: EditModalProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const { isSuperAdmin } = usePermissions();

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user?.username || "",
      role_id: user?.role.id || 0,
      team_id: user?.team?.id || null,
      agent_id: user?.agents?.id || null,
      status: user?.status ?? true,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        role_id: user.role.id,
        team_id: user.team?.id || null,
        agent_id: user.agents?.id || null,
        status: user.status,
      });
    }
  }, [user, reset]);


  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserFormData }) => userService.updateUser(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
      setError("");
      onClose();
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        const apiMessage = extractApiErrorMessage(err.response?.data);
        if (apiMessage) {
          setError(apiMessage);
          return;
        }
      }
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update user");
      }
    },
  });
  
  // Fetch data from API
  const { data: roles } = useRolesQuery();
  const { data: teams } = useTeamQuery();
  const { data: agents } = useAgentQuery();

  // Convert API data to select options
  const roleOptions: SelectOption[] = roles?.map(role => ({
    value: role.id.toString(),
    label: role.name,
  })) || [];

  const teamOptions: SelectOption[] = teams?.map(team => ({
    value: team.id.toString(),
    label: team.team_name,
  })) || [];

  const agentOptions: SelectOption[] = agents?.map(agent => ({
    value: agent.id.toString(),
    label: agent.agent_name,
  })) || [];


  const onSubmit = handleFormSubmit(async (data) => {
    if (!user) return;
    setError("");
    await updateUserMutation.mutateAsync({ id: user.id, data });
  });

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

        <form onSubmit={onSubmit} noValidate className="mt-6">
          {error && (
            <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>
                  Username <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name={field.name}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Enter username"
                      disabled={isSubmitting}
                      error={!!errors.username}
                      hint={errors.username?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Role & Assignments Section */}
          <div className="mb-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role & Assignments
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        label="Role"
                        placeholder="Select role"
                        options={roleOptions}
                        value={field.value?.toString()}
                        onChange={(value) => field.onChange(Number(value))}
                        required
                      />
                      {errors.role_id && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {errors.role_id.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              <div>
                <Controller
                  name="team_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <CustomSelect
                        label="Team"
                        placeholder="No team"
                        options={teamOptions}
                        value={field.value?.toString() || ""}
                        onChange={(value) => field.onChange(value ? Number(value) : null)}
                      />
                      {errors.team_id && (
                        <p className="mt-1.5 text-xs text-error-500">
                          {errors.team_id.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {!isSuperAdmin && (
                <div>
                  <Controller
                    name="agent_id"
                    control={control}
                    render={({ field }) => (
                      <>
                        <CustomSelect
                          label="Agent"
                          placeholder="No agent"
                          options={agentOptions}
                          value={field.value?.toString() || ""}
                          onChange={(value) => field.onChange(value ? Number(value) : null)}
                        />
                        {errors.agent_id && (
                          <p className="mt-1.5 text-xs text-error-500">
                            {errors.agent_id.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Account Status
            </h4>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
                  </label>
                </div>
              )}
            />
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
              disabled={isSubmitting}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
