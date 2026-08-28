import { useTranslation } from "react-i18next"

import { languages } from "../i18n/languages"

/**
 * Derive a BCP-47 locale tag for `Intl.*` APIs from the active i18n key.
 *
 * The dashboard stores language codes as `en`, `enGB`, `ptBR`, `zhCN`
 * (the i18n-key shape). The platform `Intl.DisplayNames`,
 * `Intl.NumberFormat`, etc. need BCP-47 (hyphenated, e.g. `en-GB`).
 *
 * If the i18n key is not in our `languages` table (e.g. the user is on
 * a fallback locale), we still hyphenate the matched letters so the
 * platform APIs get a best-effort BCP-47 form.
 */
const formatLocaleCode = (code: string): string => {
  return code.replace(/([a-z])([A-Z])/g, "$1-$2")
}

/**
 * Resolve the current BCP-47 locale tag for the active i18n language.
 * Returns `undefined` if the i18n context is unavailable.
 */
export const useLocaleTag = (): string | undefined => {
  const { i18n } = useTranslation()
  const currentLanguage = languages.find((lan) => lan.code === i18n.language)
  const code = currentLanguage?.code ?? i18n.language
  if (!code) {
    return undefined
  }
  return formatLocaleCode(code)
}
