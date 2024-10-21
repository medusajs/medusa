import { enUS } from "date-fns/locale"
import { fr } from "date-fns/locale"
import { Language } from "./types"

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "fr",
    display_name: "French",
    ltr: true,
    date_locale: fr,
  },
]
