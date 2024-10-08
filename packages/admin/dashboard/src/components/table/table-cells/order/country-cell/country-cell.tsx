import { Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { PlaceholderCell } from "../../common/placeholder-cell"
import { HttpTypes } from "@medusajs/types"

export const CountryCell = ({
  country,
}: {
  country?: HttpTypes.AdminRegionCountry | null
}) => {
  if (!country) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-5 items-center justify-center">
      <Tooltip content={country.display_name}>
        <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
          <ReactCountryFlag
            countryCode={country.iso_2!.toUpperCase()}
            svg
            style={{
              width: "16px",
              height: "16px",
            }}
            aria-label={country.display_name}
          />
        </div>
      </Tooltip>
    </div>
  )
}
