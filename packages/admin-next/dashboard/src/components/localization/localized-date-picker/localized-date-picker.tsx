import { DatePicker } from "@medusajs/ui"
import { ComponentPropsWithoutRef } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../../../i18n/config"

type LocalizedDatePickerProps = Omit<
  ComponentPropsWithoutRef<typeof DatePicker>,
  "translations" | "locale"
>

export const LocalizedDatePicker = ({
  mode = "single",
  ...props
}: LocalizedDatePickerProps) => {
  const { i18n, t } = useTranslation()

  const locale = languages.find((lang) => lang.code === i18n.language)
    ?.date_locale

  const translations = {
    cancel: t("actions.cancel"),
    apply: t("general.apply"),
    end: t("general.end"),
    start: t("general.start"),
    range: t("general.range"),
  }

  return (
    <DatePicker
      mode={mode}
      translations={translations}
      locale={locale}
      {...(props as any)}
    />
  )
}
