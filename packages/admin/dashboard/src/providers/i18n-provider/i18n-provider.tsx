import { I18nProvider as Provider } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../../i18n/languages"

type I18nProviderProps = PropsWithChildren

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const { i18n } = useTranslation()

  const locale =
    languages.find((lan) => lan.code === i18n.language)?.code ||
    languages[0].code

  return <Provider locale={locale}>{children}</Provider>
}
