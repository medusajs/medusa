import { Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { useTranslation } from "react-i18next"

import { getTranslatedCountryName } from "../../../../../lib/utils/intl"
import { PlaceholderCell } from "../../common/placeholder-cell"
import { HttpTypes } from "@medusajs/types"

type Country = Omit<HttpTypes.AdminRegionCountry, "id"> & {
  id?: string
}

export const CountryCell = ({ country }: { country?: Country | null }) => {
  const { i18n: _i18n } = useTranslation() // ensure i18n is initialized

  if (!country) {
    return <PlaceholderCell />
  }

  const displayName = country.display_name
    ? getTranslatedCountryName(country.iso_2!, country.display_name)
    : country.display_name

  return (
    <div className="flex size-5 items-center justify-center">
      <Tooltip content={displayName}>
        <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
          <ReactCountryFlag
            countryCode={country.iso_2!.toUpperCase()}
            svg
            style={{
              width: "16px",
              height: "16px",
            }}
            aria-label={displayName}
          />
        </div>
      </Tooltip>
    </div>
  )
}
