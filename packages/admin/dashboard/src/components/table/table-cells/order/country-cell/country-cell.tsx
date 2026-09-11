import { Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { PlaceholderCell } from "../../common/placeholder-cell"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { getCountryDisplayName } from "../../../../../lib/display-names"

type Country = Omit<HttpTypes.AdminRegionCountry, "id"> & {
  id?: string
}

export const CountryCell = ({ country }: { country?: Country | null }) => {
  const { i18n } = useTranslation()

  if (!country) {
    return <PlaceholderCell />
  }

  const displayName = getCountryDisplayName(
    country.iso_2,
    country.display_name ?? undefined,
    i18n.language
  )

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
