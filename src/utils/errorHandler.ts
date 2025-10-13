export const extractApiErrorMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== "object") return undefined;

  const payload = data as Record<string, unknown>;

  // Check for common error message fields
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.detail === "string") return payload.detail;

  const errors = payload.errors;
  if (!errors) return undefined;

  // Handle array of errors
  if (Array.isArray(errors)) {
    const first = errors[0];
    return typeof first === "string" ? first : undefined;
  }

  // Handle object with error fields
  if (typeof errors === "object") {
    const firstValue = Object.values(errors as Record<string, unknown>)[0];
    if (Array.isArray(firstValue)) return typeof firstValue[0] === "string" ? firstValue[0] : undefined;
    if (typeof firstValue === "string") return firstValue;
  }

  return undefined;
};
