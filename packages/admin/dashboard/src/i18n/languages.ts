import { enUS, pl } from "date-fns/locale"
import { Language } from "./types"

export const languages: Language[] = [
  {
    code: "en",
    display_name: "English",
    ltr: true,
    date_locale: enUS,
  },
  {
    code: "pl",
    display_name: "Polish",
    ltr: true,
    date_locale: pl,
  },
]
