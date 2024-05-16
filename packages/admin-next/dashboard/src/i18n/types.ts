import type { Locale } from "date-fns"
import enUS from "./translations/en.json"

const resources = {
  translation: enUS,
} as const

export type Resources = typeof resources

export type Language = {
  code: string
  display_name: string
  ltr: boolean
  date_locale: Locale
}
