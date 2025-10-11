import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ChevronDownIcon } from "../../icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  name?: string;
}

export const CustomSelect = ({
  label,
  placeholder = "Select option",
  options,
  value,
  defaultValue,
  onChange,
  required = false,
  name,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue || value || "");

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange?.(optionValue);
    closeDropdown();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValue} />

      <div className="relative mt-1">
        <button
          type="button"
          onClick={toggleDropdown}
          className="relative flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <span className={selectedOption ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 dark:text-gray-400 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute left-0 right-0 z-50 mt-2 flex max-h-60 w-full flex-col overflow-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-dark"
        >
          <ul className="flex flex-col gap-1">
            {options.map((option) => (
              <li key={option.value}>
                <DropdownItem
                  onItemClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    selectedValue === option.value
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedValue === option.value && (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </DropdownItem>
              </li>
            ))}
          </ul>
        </Dropdown>
      </div>
    </div>
  );
};
