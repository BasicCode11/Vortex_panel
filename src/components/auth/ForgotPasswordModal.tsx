import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { Modal } from "../ui/modal";
import { useTranslation } from "react-i18next";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { authService } from "../../services/api/authService";
import { extractApiErrorMessage } from "../../utils/errorHandler";
import {
  forgotPasswordSchema,
  verifyResetCodeSchema,
  resetPasswordSchema,
  type ForgotPasswordRequest,
  type VerifyResetCodeRequest,
  type ResetPasswordRequest,
} from "../../schemas/authSchema";
import { EyeCloseIcon, EyeIcon } from "../../icons";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "code" | "password";

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const {t} = useTranslation();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<VerifyResetCodeRequest>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { email: "", code: "" },
  });

  const passwordForm = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { reset_token: "", new_password: "" },
  });

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setResetToken("");
    setShowPassword(false);
    emailForm.reset();
    codeForm.reset();
    passwordForm.reset();
    onClose();
  };

  const onEmailSubmit = emailForm.handleSubmit(async (data) => {
    try {
      const response = await authService.forgotPassword(data);
      setEmail(data.email);
      toast.success(response.message || t("forgot.success"));
      setStep("code");
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = extractApiErrorMessage(err.response?.data);
        toast.error(apiMessage || t("forgot.faild"));
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  });

  const onCodeSubmit = codeForm.handleSubmit(async (data) => {
    try {
      const response = await authService.verifyResetCode({ ...data, email });
      setResetToken(response.reset_token);
      toast.success(response.message || t("code.success"));
      setStep("password");
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = extractApiErrorMessage(err.response?.data);
        toast.error(apiMessage || "Invalid verification code");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (data) => {
    try {
      const response = await authService.resetPassword({ ...data, reset_token: resetToken });
      toast.success(response.message || "Password reset successfully!");
      handleClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const apiMessage = extractApiErrorMessage(err.response?.data);
        toast.error(apiMessage || "Failed to reset password");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4 sm:mx-auto">
      <div className="p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white">
          {t("forgot.title")}
        </h2>

        {/* Step 1: Enter Email */}
        {step === "email" && (
          <form onSubmit={onEmailSubmit}>
            <div className="mb-6">
              <Label>
                {t("user.email")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="email"
                control={emailForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("validate.email")}
                    disabled={emailForm.formState.isSubmitting}
                    error={!!emailForm.formState.errors.email}
                    hint={emailForm.formState.errors.email?.message}
                  />
                )}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("validate.send")}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={emailForm.formState.isSubmitting}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting ? t("code.sending") : t("code.sendcode")}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Enter Verification Code */}
        {step === "code" && (
          <form onSubmit={onCodeSubmit}>
            <div className="mb-6">
              <Label>
                {t("verify.code")} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="code"
                control={codeForm.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("validate.code")}
                    disabled={codeForm.formState.isSubmitting}
                    error={!!codeForm.formState.errors.code}
                    hint={codeForm.formState.errors.code?.message}
                  />
                )}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("validate.codewell")}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={codeForm.formState.isSubmitting}
              >
                {codeForm.formState.isSubmitting ? t("verify.verifycoding") : t("verify.verifycode")}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Enter New Password */}
        {step === "password" && (
          <form onSubmit={onPasswordSubmit}>
            <div className="mb-6">
              <Label>
                {t("user.newpassword")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Controller
                  name="new_password"
                  control={passwordForm.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("validate.newpassword")}
                      disabled={passwordForm.formState.isSubmitting}
                      error={!!passwordForm.formState.errors.new_password}
                      hint={passwordForm.formState.errors.new_password?.message}
                    />
                  )}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {t("validate.newpass")}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? t("rest.resspasswording") : t("rest.resspassword")}
              </Button>
            </div>
          </form>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div
            className={`h-2 w-2 rounded-full ${
              step === "email" ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full ${
              step === "code" ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full ${
              step === "password" ? "bg-primary-500" : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        </div>
      </div>
    </Modal>
  );
};
