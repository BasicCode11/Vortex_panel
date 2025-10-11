import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useUsersQuery } from "../../hooks/queries/useUsersQuery";
import { useModal } from "../../hooks/useModal";
import { UserAddIcon, PencilIcon, TrashBinIcon} from "../../icons";
import { AddModal } from "./AddModal";
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";
import { type UserResponse } from "../../schemas/userSchema";

export default function User() {
  const { data: users = [], isLoading, error } = useUsersQuery();
  const { t } = useTranslation();
  const { isOpen: isCreateOpen, openModal: openCreate, closeModal: closeCreate } = useModal();
  const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal();
  
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  console.log("User ", users)
  const handleEdit = (user: UserResponse) => {
    setSelectedUser(user);
    openEdit();
  };

  const handleDelete = (user: UserResponse) => {
    setSelectedUser(user);
    openDelete();
  };

  return (
    <div>
      <PageMeta
        title="User"
        description="This is User management page"
      />
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("sidebar.users")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your team members and their permissions
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <UserAddIcon className="h-5 w-5" />
          Create User
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">

        {!isLoading && !error && (
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {t("common.nO")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {t("header.name")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {t("common.role")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                     {t("sidebar.teams")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                       {t("sidebar.agents")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      {t("common.status")}
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Last Active
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      {t("common.actions")}
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((u, index) => (
                    <TableRow key={u.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{index + 1}</span>
                      </TableCell>                      
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {u.username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {u.role.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {u.team?.team_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {u.agents?.agent_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge color={u.status ? "success" : "warning"} variant="solid" size="sm">
                            {u.status ? "Active": "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(u.last_active).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                            title="Delete"
                          >
                            <TrashBinIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell className="px-5 py-6 text-center text-gray-400">
                        No user found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-dashed border-brand-500"></div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="px-6 py-12">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Failed to load users'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddModal isOpen={isCreateOpen} onClose={closeCreate} />
      <EditModal isOpen={isEditOpen} onClose={closeEdit} user={selectedUser} />
      <DeleteModal isOpen={isDeleteOpen} onClose={closeDelete} user={selectedUser} />
    </div>
  );
}
