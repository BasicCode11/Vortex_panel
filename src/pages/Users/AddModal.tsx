// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { isAxiosError } from "axios";
// import { Modal } from "../../components/ui/modal";
// import { CustomSelect, SelectOption } from "../../components/form/CustomSelect";
// import Input from "../../components/form/input/InputField";
// import Label from "../../components/form/Label";
// import { usePermissions } from "../../hooks/usePermission";
// import { useAgentQuery } from "../../hooks/queries/useAgentQuery";
// import { useTeamQuery } from "../../hooks/queries/useTeamQuery";
// import { useRolesQuery } from "../../hooks/queries/useRolesQuery";
// import { createUserSchema, type CreateUserFormData } from "../../schemas/userSchema";
// import { userService } from "../../services/api/userService";
// import { extractApiErrorMessage } from "../../utils/errorHandler";

// interface AddModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }


// export const AddModal = ({ isOpen, onClose }: AddModalProps) => {
//   const { isSuperAdmin } = usePermissions();
//   const queryClient = useQueryClient();
//   const [error, setError] = useState("");

//   const {
//     control,
//     handleSubmit: handleFormSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateUserFormData>({
//     resolver: zodResolver(createUserSchema),
//     defaultValues: {
//       username: "",
//       password: "",
//       role_id: 0,
//       team_id: null,
//       agent_id: null,
//       status: true,
//     },
//   });


//   const { data: roles } = useRolesQuery();
//   const { data: teams } = useTeamQuery();
//   const { data: agents } = useAgentQuery();

//   const createUserMutation = useMutation({
//     mutationFn: (payload: CreateUserFormData) => userService.createUser(payload),
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: ["users"] });
//       toast.success("User created successfully!");
//       reset();
//       setError("");
//       onClose();
//     },
//     onError: (err) => {
//       if (isAxiosError(err)) {
//         const apiMessage = extractApiErrorMessage(err.response?.data);
//         if (apiMessage) {
//           setError(apiMessage);
//           return;
//         }
//       }
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("Failed to create user");
//       }
//     },
//   });

//   const roleOptions: SelectOption[] = roles?.map(role => ({
//     value: role.id.toString(),
//     label: role.name,
//   })) || [];
//   const teamOptions: SelectOption[] = teams?.map(team => ({
//     value: team.id.toString(),
//     label: team.team_name,
//   })) || [];

//   const agentOptions: SelectOption[] = agents?.map(agent => ({
//     value: agent.id.toString(),
//     label: agent.agent_name,
//   })) || [];

//   const onSubmit = handleFormSubmit(async (data) => {
//     setError("");
//     await createUserMutation.mutateAsync(data);
//   });

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//           Create New User
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           Add a new user to your team
//         </p>

//         <form onSubmit={onSubmit} noValidate className="mt-6">
//           {error && (
//             <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
//               {error}
//             </div>
//           )}

//           {/* Account Information Section */}
//           <div className="mb-6">
//             <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
//               Account Information
//             </h4>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <Label>
//                   Username <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="username"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       name={field.name}
//                       value={field.value}
//                       onChange={field.onChange}
//                       placeholder="Enter username"
//                       disabled={isSubmitting}
//                       error={!!errors.username}
//                       hint={errors.username?.message}
//                     />
//                   )}
//                 />
//               </div>

//               <div>
//                 <Label>
//                   Password <span className="text-red-500">*</span>
//                 </Label>
//                 <Controller
//                   name="password"
//                   control={control}
//                   render={({ field }) => (
//                     <Input
//                       type="password"
//                       name={field.name}
//                       value={field.value}
//                       onChange={field.onChange}
//                       placeholder="Enter password"
//                       disabled={isSubmitting}
//                       error={!!errors.password}
//                       hint={errors.password?.message}
//                     />
//                   )}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Role & Permissions Section */}
//           <div className="mb-6">
//             <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
//               Role & Permissions
//             </h4>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               <div>
//                 <Controller
//                   name="role_id"
//                   control={control}
//                   render={({ field }) => (
//                     <>
//                       <CustomSelect
//                         label="Role"
//                         placeholder="Select role"
//                         options={roleOptions}
//                         value={field.value?.toString()}
//                         onChange={(value) => field.onChange(Number(value))}
//                         required
//                       />
//                       {errors.role_id && (
//                         <p className="mt-1.5 text-xs text-error-500">
//                           {errors.role_id.message}
//                         </p>
//                       )}
//                     </>
//                   )}
//                 />
//               </div>

//               <div>
//                 <Controller
//                   name="team_id"
//                   control={control}
//                   render={({ field }) => (
//                     <>
//                       <CustomSelect
//                         label="Team"
//                         placeholder="Select team"
//                         options={teamOptions}
//                         value={field.value?.toString() || ""}
//                         onChange={(value) => field.onChange(value ? Number(value) : null)}
//                       />
//                       {errors.team_id && (
//                         <p className="mt-1.5 text-xs text-error-500">
//                           {errors.team_id.message}
//                         </p>
//                       )}
//                     </>
//                   )}
//                 />
//               </div>

//               {!isSuperAdmin && (
//                 <div>
//                   <Controller
//                     name="agent_id"
//                     control={control}
//                     render={({ field }) => (
//                       <>
//                         <CustomSelect
//                           label="Agent"
//                           placeholder="Select agent"
//                           options={agentOptions}
//                           value={field.value?.toString() || ""}
//                           onChange={(value) => field.onChange(value ? Number(value) : null)}
//                         />
//                         {errors.agent_id && (
//                           <p className="mt-1.5 text-xs text-error-500">
//                             {errors.agent_id.message}
//                           </p>
//                         )}
//                       </>
//                     )}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Status Section */}
//           <div className="mb-6">
//             <h4 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
//               Account Status
//             </h4>
//             <Controller
//               name="status"
//               control={control}
//               render={({ field }) => (
//                 <div className="flex items-center gap-4">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       checked={field.value === true}
//                       onChange={() => field.onChange(true)}
//                       className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
//                     />
//                     <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       checked={field.value === false}
//                       onChange={() => field.onChange(false)}
//                       className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
//                     />
//                     <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
//                   </label>
//                 </div>
//               )}
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               {isSubmitting ? "Creating..." : "Create User"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };
