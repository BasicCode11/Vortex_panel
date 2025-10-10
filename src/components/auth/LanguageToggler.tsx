import { useTranslation } from "react-i18next";

export default function LanguageToggler() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'km' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    document.documentElement.setAttribute('lang', newLanguage);
  };

  const isKhmer = i18n.language === 'km';

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center transition-colors rounded-full size-14 border-2 border-white/20 hover:border-white/40"
    >
      {/* English Flag - Show when current language is Khmer */}
      <img 
        src="/united_kingdom_round_icon_64.png" 
        alt="English"
        className={`w-full h-full rounded-full object-cover ${isKhmer ? 'block' : 'hidden'}`}
      />
      {/* Khmer Flag - Show when current language is English */}
      <img 
        src="/cambodia_round_icon_64.png" 
        alt="Khmer"
        className={`w-full h-full rounded-full object-cover ${!isKhmer ? 'block' : 'hidden'}`}
      />
    </button>
  );
}
