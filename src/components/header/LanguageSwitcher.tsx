import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const languages = [
  {
    code: "en",
    name: "English",
    flag: "/united_kingdom_round_icon_64.png",
  },
  {
    code: "km",
    name: "ខ្មែរ",
    flag: "/cambodia_round_icon_64.png",
  },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function changeLanguage(languageCode: string) {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
    document.documentElement.setAttribute('lang', languageCode);
    closeDropdown();
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center gap-2 text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg dropdown-toggle hover:text-gray-700 h-11 px-3 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <img 
          src={currentLanguage.flag} 
          alt={currentLanguage.name}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className={`hidden text-sm font-medium sm:block ${currentLanguage.code === 'km' ? 'font-khmer' : 'font-english'}`}>
          {currentLanguage.name}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[200px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <ul className="flex flex-col gap-1">
          {languages.map((language) => (
            <li key={language.code}>
              <DropdownItem
                onItemClick={() => changeLanguage(language.code)}
                className={`flex items-center gap-3 px-3 py-2 font-medium rounded-lg group text-theme-sm cursor-pointer transition-colors ${
                  currentLanguage.code === language.code
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                }`}
              >
                <img 
                  src={language.flag} 
                  alt={language.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className={language.code === 'km' ? 'font-khmer' : 'font-english'}>
                  {language.name}
                </span>
                {currentLanguage.code === language.code && (
                  <svg
                    className="w-5 h-5 ml-auto"
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
  );
}
