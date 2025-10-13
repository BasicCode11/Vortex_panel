type LoadingSpinnerProps = {
  label?: string;
  sizeClass?: string;
  wrapperClassName?: string;
};

export const LoadingSpinner = ({
  label = "Loading...",
  sizeClass = "h-12 w-12",
  wrapperClassName = "py-12",
}: LoadingSpinnerProps) => (
  <div className={`flex items-center justify-center ${wrapperClassName}`}>
    <div className="text-center">
      <div
        className={`mx-auto ${sizeClass} animate-spin rounded-full border-4 border-dashed border-brand-500`}
      ></div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default LoadingSpinner;
