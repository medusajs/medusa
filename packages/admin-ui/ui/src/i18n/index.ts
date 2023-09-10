import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import Backend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import translateAr from "../../public/locales/ar/translation.json"
import translateEn from "../../public/locales/en-US/translation.json"


void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    returnNull: false,
    fallbackLng: ["en-US","ar"],
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    load: "currentOnly",
    resources: {
      "en-US": {
        translation: translateEn,
      },
      ar: {
        translation: translateAr,
      },
    },
  })

export default i18n
declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false
  }
}
