import { Country } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

type CountriesCellProps = {
  countries?: Country[] | null
}

export const CountriesCell = ({ countries }: CountriesCellProps) => {
  const { t } = useTranslation()

  if (!countries || countries.length === 0) {
    return <PlaceholderCell />
  }

  const displayValue = countries
    .slice(0, 2)
    .map((c) => c.display_name)
    .join(", ")

  const additionalCountries = countries
    .slice(2)
    .map((c) => c.display_name).length

  const text = `${displayValue}${
    additionalCountries > 0
      ? ` ${t("general.plusCountMore", {
          count: additionalCountries,
        })}`
      : ""
  }`

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{text}</span>
    </div>
  )
}

export const CountriesHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full items-center">
      <span>{t("fields.countries")}</span>
    </div>
  )
}
