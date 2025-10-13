
import { FaRegEdit } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageMeta from "../../components/common/PageMeta";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/ui/table";
import { useRolesPermissionQuery, } from "../../hooks/queries/useRolesQuery";
import { TrashBinIcon, UserAddIcon } from "../../icons";
import { useTranslation } from "react-i18next";

export default function RolePermission() {
    const { data: roles = [], isLoading, error } = useRolesPermissionQuery();
    const { t } = useTranslation();

    return (
        <div>
            <PageMeta
                title="RolePermission"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            {/* Header with Create Button */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {t("sidebar.rolePermissions")}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your roles and their permissions
                    </p>
                </div>
                <button
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    <UserAddIcon className="h-5 w-5" />
                    Create Role
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
                                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                                            {t("common.actions")}
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {roles.map((r, index) => (
                                        <TableRow key={r.id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{index + 1}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {r.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {r.description}
                                            </TableCell>

                                            <TableCell className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button

                                                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                                                        title="Edit"
                                                    >
                                                        <FaRegEdit className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                                                        title="Delete"
                                                    >
                                                        <TrashBinIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {roles.length === 0 && (
                                        <TableRow>
                                            <TableCell className="px-5 py-6 text-center text-gray-400">
                                                No Roles found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && <LoadingSpinner label="Loading Roles..." />}

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
        </div>
    );
}
