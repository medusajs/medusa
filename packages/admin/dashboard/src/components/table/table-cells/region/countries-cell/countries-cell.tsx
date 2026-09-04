import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"

import { countries as COUNTRIES } from "../../../../../lib/data/countries"
import { getTranslatedCountryName } from "../../../../../lib/utils/intl"
import { ListSummary } from "../../../../common/list-summary"
import { PlaceholderCell } from "../../common/placeholder-cell"

type CountriesCellProps = {
  countries?: HttpTypes.AdminRegionCountry[] | null
}

export const CountriesCell = ({ countries }: CountriesCellProps) => {
  if (!countries || countries.length === 0) {
    return <PlaceholderCell />
  }

  const list = countries
    .map((country) =>
      getTranslatedCountryName(
        country.iso_2,
        COUNTRIES.find((c) => c.iso_2 === country.iso_2)?.display_name ||
          country.display_name
      )
    )
    .filter(Boolean) as string[]

  return (
    <div className="flex size-full items-center overflow-hidden">
      <ListSummary list={list} />
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
