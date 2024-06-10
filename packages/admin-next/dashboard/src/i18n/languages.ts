import { enUS } from "date-fns/locale"
import { ar } from "date-fns/locale"
import { Language } from "./types"

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "ar",
    display_name: "Arabic (العربية)",
    ltr: false,
    date_locale: ar,
  },
]
