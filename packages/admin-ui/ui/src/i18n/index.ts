import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    returnNull: false,
    fallbackLng: ["fa-IR", "en-US"],
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    load: "currentOnly",
  })

export default i18n
declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false
  }
}
