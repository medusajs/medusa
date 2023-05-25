import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en/translation.json"
import fa from "./locales/fa-IR/translation.json"

void i18n
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    returnNull: false,
    lng: "fa-IR",
    fallbackLng: "en",
    debug: true,
    resources: {
      en: { translation: en },
      "fa-IR": { translation: fa },
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false
  }
}
