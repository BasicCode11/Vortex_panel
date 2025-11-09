import { useTranslation } from "react-i18next";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useUsersQuery } from "../../hooks/queries/useUsersQuery";
import { useRolesQuery } from "../../hooks/queries/useRolesQuery";
import { useModal } from "../../hooks/useModal";
import { usePermissions } from "../../hooks/usePermission";
import { UserAddIcon, TrashBinIcon, LockIcon } from "../../icons";
import { FaRegEdit } from "react-icons/fa";
// import { AddModal } from "./AddModal";
// import { EditModal } from "./EditModal";
// import { DeleteModal } from "./DeleteModal";
// import { PasswordModal } from "./PasswordModal";
import { type UserResponse } from "../../schemas/userSchema";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

export default function User() {
  const { data: users = [], isLoading, error } = useUsersQuery();
  const { t } = useTranslation();
  const { isSuperAdmin } = usePermissions();
  
  // Prefetch roles, teams, and agents for modals
  useRolesQuery();
  // const { isOpen: isCreateOpen, openModal: openCreate, closeModal: closeCreate } = useModal();
  // const { isOpen: isEditOpen, openModal: openEdit, closeModal: closeEdit } = useModal();
  // const { isOpen: isDeleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal();
  // const { isOpen: isPasswordOpen, openModal: openPassword, closeModal: closePassword } = useModal();
  
  // const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const { openModal: openEdit } = useModal();
  const { openModal: openPassword } = useModal();
  const { openModal: openDelete } = useModal();
  
  const handleEdit = (user: UserResponse) => {
    // setSelectedUser(user);
    console.log('Edit user:', user);
    openEdit();
  };

  const handlePassword = (user: UserResponse) => {
    // setSelectedUser(user);
    console.log('Change password for user:', user);
    openPassword();
  };

  const handleDelete = (user: UserResponse) => {
    // setSelectedUser(user);
    console.log('Delete user:', user);
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
                        {u.role.name}
                      </TableCell>
                    
                     
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <FaRegEdit className="h-4 w-4" />
                          </button>
                          {isSuperAdmin && (
                            <button
                              onClick={() => handlePassword(u)}
                              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-orange-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-orange-400"
                              title="Change Password"
                            >
                              <LockIcon className="h-4 w-4" />
                            </button>
                          )}
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
        {isLoading && <LoadingSpinner label="Loading users..." />}

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
      {/* <AddModal isOpen={isCreateOpen} onClose={closeCreate} />
      <EditModal isOpen={isEditOpen} onClose={closeEdit} user={selectedUser} />
      <PasswordModal isOpen={isPasswordOpen} onClose={closePassword} user={selectedUser} />
      <DeleteModal isOpen={isDeleteOpen} onClose={closeDelete} user={selectedUser} /> */}
    </div>
  );
}
