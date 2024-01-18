import { enUS } from "date-fns/locale"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend, { type HttpBackendOptions } from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

import { Language } from "./types"

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
  })

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
]

export default i18n
