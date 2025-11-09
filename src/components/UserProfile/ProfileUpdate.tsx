import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { updateUserSchema, type UpdateUserFormData, type UserResponse } from "../../schemas/userSchema";
import { userService } from "../../services/api/userService";
import { extractApiErrorMessage } from "../../utils/errorHandler";
import { MdOutlineFileUpload } from "react-icons/md";
interface ProfileUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export const ProfileUpdate = ({ isOpen, onClose, user }: ProfileUpdateProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [picturePreview, setPicturePreview] = useState<string | null>(user?.picture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      phone: user?.phone || "",
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
      });
      setPicturePreview(user.picture);
    }
  }, [user, reset]);

  // Watch picture field for preview
  const pictureFile = watch("picture");
  useEffect(() => {
    if (pictureFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(pictureFile);
    }
  }, [pictureFile]);

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserFormData }) => 
      userService.updateUser(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
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
        setError("Failed to update profile");
      }
    },
  });

  const onSubmit = handleFormSubmit(async (data) => {
    if (!user) return;
    setError("");
    
    console.log('Raw form data:', data);
    
    // Create a clean object with ONLY the fields we want to update
    const cleanedData: Partial<UpdateUserFormData> = {};
    
    // Explicitly add only non-empty fields from the form
    if (data.first_name && typeof data.first_name === 'string' && data.first_name.trim() !== '') {
      cleanedData.first_name = data.first_name.trim();
    }
    
    if (data.last_name && typeof data.last_name === 'string' && data.last_name.trim() !== '') {
      cleanedData.last_name = data.last_name.trim();
    }
    
    if (data.phone && typeof data.phone === 'string' && data.phone.trim() !== '') {
      cleanedData.phone = data.phone.trim();
    }
    
    if (data.picture instanceof File) {
      cleanedData.picture = data.picture;
    }
    
    console.log('Cleaned data to send:', cleanedData);
    console.log('Keys in cleaned data:', Object.keys(cleanedData));
    
    await updateUserMutation.mutateAsync({ id: user.id, data: cleanedData as UpdateUserFormData });
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      // Validate file type
      if (!file.type.match(/^image\/(png|jpg|jpeg)$/)) {
        setError("Only PNG and JPG files are allowed");
        return;
      }
      setValue("picture", file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    setValue("picture", undefined);
    setPicturePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const getInitials = () => {
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || '?';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[650px] m-4 mt-99">
      <div className="no-scrollbar relative w-full max-w-[650px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        <div className="mb-6">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
            Edit Profile
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your personal information
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          {error && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex-shrink-0">
              {picturePreview ? (
                <img
                  src={picturePreview}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                  <span className="text-2xl font-bold text-white">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                Profile Picture
              </h5>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                PNG, JPG up to 5MB
              </p>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button size="sm" variant="outline" type="button" onClick={handleUploadClick}>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload
                </Button>
                {picturePreview && (
                  <Button size="sm" variant="outline" type="button" onClick={handleRemovePicture}>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                    error={!!errors.first_name}
                    hint={errors.first_name?.message}
                  />
                )}
              />
            </div>

            <div>
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                    error={!!errors.last_name}
                    hint={errors.last_name?.message}
                  />
                )}
              />
            </div>

            <div className="lg:col-span-2">
              <Label>
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={user?.email || ""}
                placeholder="email@example.com"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>

            <div className="lg:col-span-2">
              <Label>Phone Number</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                    error={!!errors.phone}
                    hint={errors.phone?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
              Account Information
            </h5>
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Role</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {user.role?.name || 'No Role'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Email Verified</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.email_verified
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {user.email_verified ? (
                    <>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </>
                  ) : (
                    'Not Verified'
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
