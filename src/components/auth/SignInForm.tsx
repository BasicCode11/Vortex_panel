import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { loginSchema } from "../../schemas/authSchema";
import type { LoginRequest } from "../../schemas/authSchema";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
      if (axiosError?.response?.status === 401) {
        setError(t("common.error"));
      } else {
        setError(axiosError?.response?.data?.detail || "An error occurred. Please try again.");
      }
    }
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto ">
        <div className="">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {t("user.signIn")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("common.lableUserPass")}
            </p>
          </div>
          <div>
            <form onSubmit={onSubmit} noValidate>
              <div className="space-y-6">
                {error && (
                  <div className="px-4 py-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <Label>
                    {t("user.email")} <span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("user.email")}
                        disabled={isSubmitting}
                        error={!!errors.email}
                        hint={errors.email?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Label>
                    {t("user.passWord")} <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("user.passWord")}
                          disabled={isSubmitting}
                          error={!!errors.password}
                          hint={errors.password?.message}
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
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : t("user.signIn")}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-primary-300 transition-colors"
                  >
                    {t("forgot.title")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
