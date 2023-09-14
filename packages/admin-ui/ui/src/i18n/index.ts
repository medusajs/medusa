import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const supportedLanguages = [
  {
    locale: "en",
    name: "English",
  },
  {
    locale: "fr",
    name: "Français",
  },
]

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: supportedLanguages.map((l) => l.locale),
    fallbackLng: "en",
    returnNull: false,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    load: "currentOnly",
    // https://github.com/i18next/i18next-browser-languageDetector#detector-options
    detection: {
      convertDetectedLanguage: (lng) => lng.split("-")[0],
    },
  })
