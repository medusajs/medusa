import { Country } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
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

  const additionalCountries = countries.slice(2).map((c) => c.display_name)

  return (
    <div className="flex size-full items-center gap-x-1">
      <span>{displayValue}</span>
      {additionalCountries.length > 0 && (
        <Tooltip
          collisionPadding={16}
          content={
            <ul>
              {additionalCountries.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          }
        >
          <span>
            {t("general.plusCountMore", {
              count: additionalCountries.length,
            })}
          </span>
        </Tooltip>
      )}
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
