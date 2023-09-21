import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import { getFullAdminPath } from "../utils/get-admin-path"

export const supportedLanguages = [
  {
    locale: "en",
    name: "English",
  },
  {
    locale: "fr",
    name: "Français",
  },
  {
    locale: "pt",
    name: "Português (Brasil)",
  },
  {
    locale: "pl",
    name: "Polski",
  },
]

const adminPath = getFullAdminPath()
const pathToLoadFrom = `${adminPath}public/locales/{{lng}}/{{ns}}.json`

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      loadPath: pathToLoadFrom,
    },
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
