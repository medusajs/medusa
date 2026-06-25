import { enUS, sk } from "date-fns/locale"
import { Language } from "./types"

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "sk",
    display_name: "Slovenčina",
    ltr: true,
    date_locale: sk,
  },
]
