// import { useEffect } from "react";
// import { toast } from "react-toastify";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { isAxiosError } from "axios";
// import { Modal } from "../../components/ui/modal";
// import { 
//   type UserResponse, 
//   updatePasswordSchema,
//   type UpdatePasswordFormData
// } from "../../schemas/userSchema";
// import Input from "../../components/form/input/InputField";
// import Label from "../../components/form/Label";
// import { userService } from "../../services/api/userService";
// import { extractApiErrorMessage } from "../../utils/errorHandler";

// interface PasswordModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   user: UserResponse | null;
// }

// export const PasswordModal = ({ isOpen, onClose, user }: PasswordModalProps) => {
//   const queryClient = useQueryClient();

//   const {
//     control,
//     handleSubmit: handleFormSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<UpdatePasswordFormData>({
//     resolver: zodResolver(updatePasswordSchema),
//     defaultValues: {
//       new_password: "",
//     },
//   });

//   // Reset form when user changes or modal opens
//   useEffect(() => {
//     if (isOpen) {
//       reset({ new_password: "" });
//     }
//   }, [isOpen, reset]);

//   const updatePasswordMutation = useMutation({
//     mutationFn: ({ id, data }: { id: number; data: UpdatePasswordFormData }) => {
//       console.log('Sending password update:', { id, data });
//       return userService.updateUserPassword(id, data);
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({ queryKey: ['users'] });
//       toast.success("Password updated successfully!");
//       reset({ new_password: "" });
//       onClose();
//     },
//     onError: (err) => {
//       if (isAxiosError(err)) {
//         console.error('Password update error:', err.response?.data);
//         const apiMessage = extractApiErrorMessage(err.response?.data);
//         if (apiMessage) {
//           toast.error(apiMessage);
//           return;
//         }
//       }
//       if (err instanceof Error) {
//         toast.error(err.message);
//       } else {
//         toast.error("Failed to update password");
//       }
//     },
//   });

//   const onSubmit = handleFormSubmit(async (data) => {
//     if (!user) return;
//     await updatePasswordMutation.mutateAsync({ id: user.id, data });
//   });

//   if (!user) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
//       <div className="p-6">
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//           Update Password
//         </h3>
//         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//           Change password for <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
//         </p>

//         <form onSubmit={onSubmit} noValidate className="mt-6">
//           {/* User ID Badge */}
//           <div className="mb-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
//               <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
//                 #{user.id}
//               </span>
//             </div>
//             <div>
//               <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
//               <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
//             </div>
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <Label>
//               New Password <span className="text-red-500">*</span>
//             </Label>
//             <Controller
//               name="new_password"
//               control={control}
//               render={({ field }) => (
//                 <Input
//                   type="password"
//                   name={field.name}
//                   value={field.value}
//                   onChange={field.onChange}
//                   placeholder="Enter new password (min 6 characters)"
//                   disabled={isSubmitting}
//                   error={!!errors.new_password}
//                   hint={errors.new_password?.message}
//                 />
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
//               className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               {isSubmitting ? "Updating..." : "Update Password"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };
