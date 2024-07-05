import type { Locale } from "date-fns"
import en from "../../public/locales/en-US/translation.json"

const resources = {
  translation: en,
} as const

export type Resources = typeof resources

export type Language = {
  code: string
  display_name: string
  ltr: boolean
  date_locale: Locale
}
