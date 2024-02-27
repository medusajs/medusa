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
    locale: "de",
    name: "Deutsch",
  },
  {
    locale: "fr",
    name: "Français",
  },
  {
    locale: "hr",
    name: "Hrvatski",
  },
  {
    locale: "it",
    name: "Italiano",
  },
  {
    locale: "pt",
    name: "Português (Brasil)",
  },
  {
    locale: "uk",
    name: "Українська",
  },
  {
    locale: "ar",
    name: "العربية",
  },
  {
    locale: "pl",
    name: "Polski",
  },
  {
    locale: "es",
    name: "Español",
  },
  {

    locale: "hi",
    name: "Hindi",
  },
  {
    locale: "bs",
    name: "Bosanski",
  },
  {
    locale: "vi",
    name: "Tiếng Việt",
  },
  {
    locale: "tm",
    name: "Tamil",
  },
  {
    locale: "ru",
    name: "Русский",
  },
  {
    locale: "sl",
    name: "Slovenščina",
  },
  {
    locale: "bg",
    name: "Български",
  },
  {
    locale: "ko",
    name: "한국어"
  },
  {
    locale: "ja",
    name: "日本語"
  },
  {
    locale: "cs",
    name: "Čeština"
  },
  {
    locale: "zh",
    name: "简体中文",
  }
].sort((a, b) => a.locale.localeCompare(b.locale))

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
