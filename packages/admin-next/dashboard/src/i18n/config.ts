import { enUS, zhCN } from "date-fns/locale"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend, { type HttpBackendOptions } from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

import { Language } from "./types"

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    fallbackLng: "en-US",
    load: "currentOnly",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // for all available options read the backend's repository readme file
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })

export const languages: Language[] = [
  {
    code: "en-US",
    display_name: "English (US)",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "zh-CN",
    display_name: "中文 (简体)",
    ltr: true,
    date_locale: zhCN,
  },
]

export default i18n
