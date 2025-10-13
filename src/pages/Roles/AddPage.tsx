import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Checkbox from "../../components/form/input/Checkbox";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { roleService } from "../../services/api/roleService";
import { usePermissionQuery } from "../../hooks/queries/useRolesQuery";
import { createRoleSchema, type CreateRole, type Permission } from "../../schemas/roleSchema";

type Action = "read" | "create" | "update" | "delete";
const ACTIONS: Action[] = ["read", "create", "update", "delete"];

export default function AddPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: permissions = [], isLoading, error } = usePermissionQuery();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateRole>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", description: "", permission_ids: [] },
  });

  const [selected, setSelected] = useState<Set<number>>(new Set());

  const permissionMatrix = useMemo(() => {
    const map = new Map<string, Partial<Record<Action, Permission>>>();
    permissions.forEach((p) => {
      const [resource, action] = p.name.split(":") as [string, Action | undefined];
      const key = (resource || p.name).toLowerCase();
      if (!map.has(key)) map.set(key, {});
      if (action && ACTIONS.includes(action)) {
        map.get(key)![action] = p;
      }
    });
    return Array.from(map.entries()).map(([resource, actions]) => ({ resource, actions }));
  }, [permissions]);

  const togglePermission = (permId: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(permId); else next.delete(permId);
      setValue("permission_ids", Array.from(next));
      return next;
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateRole) => roleService.createRole(payload),
    onSuccess: async () => {
      toast.success("Role created successfully!");
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
      navigate("/role-permission");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await createMutation.mutateAsync(values);
  });

  return (
    <div>
      <PageMeta title="Create Role" description="Create a new role and assign permissions" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Create Role</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Define role name, description, and assign permissions</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/role-permission")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Back
        </button>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Basic Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter role name"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.name}
                    hint={errors.name?.message}
                  />
                )}
              />
            </div>
            <div>
              <Label>Descriptions</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea placeholder="Optional description" value={field.value ?? ""} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Permissions</h3>

          {isLoading && <LoadingSpinner label="Loading permissions..." />}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              Failed to load permissions
            </div>
          )}

          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.05] text-theme-xs text-gray-500 dark:text-gray-400">
                    <th className="px-4 py-3">Permission Name</th>
                    {ACTIONS.map((a) => (
                      <th key={a} className="px-4 py-3 capitalize">{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {permissionMatrix.map(({ resource, actions }) => (
                    <tr key={resource}>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90 capitalize">{resource.replace(/-/g, " ") }</td>
                      {ACTIONS.map((a) => {
                        const p = actions[a];
                        return (
                          <td key={a} className="px-4 py-3">
                            {p ? (
                              <Checkbox
                                checked={selected.has(p.id)}
                                onChange={(c) => togglePermission(p.id, c)}
                              />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {permissionMatrix.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-400" colSpan={5}>No permissions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/role-permission")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting || createMutation.isPending ? "Creating..." : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
}
