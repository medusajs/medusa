import { Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { PlaceholderCell } from "../../common/placeholder-cell"
import { HttpTypes } from "@medusajs/types"

import { useLocaleTag } from "../../../../hooks/use-locale-tag"
import { getCountryDisplayName } from "../../../../lib/display-names"

type Country = Omit<HttpTypes.AdminRegionCountry, "id"> & {
  id?: string
}

export const CountryCell = ({ country }: { country?: Country | null }) => {
  const localeTag = useLocaleTag()
  const localizedName =
    getCountryDisplayName(country?.iso_2, localeTag) ?? country?.display_name

  if (!country) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-5 items-center justify-center">
      <Tooltip content={localizedName}>
        <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
          <ReactCountryFlag
            countryCode={country.iso_2!.toUpperCase()}
            svg
            style={{
              width: "16px",
              height: "16px",
            }}
            aria-label={localizedName}
          />
        </div>
      </Tooltip>
    </div>
  )
}
