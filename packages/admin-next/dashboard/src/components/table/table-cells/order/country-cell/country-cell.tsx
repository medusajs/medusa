import { Country } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import ReactCountryFlag from "react-country-flag"
import { PlaceholderCell } from "../../common/placeholder-cell"

export const CountryCell = ({ country }: { country?: Country | null }) => {
  if (!country) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-5 items-center justify-center">
      <Tooltip content={country.display_name}>
        <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
          <ReactCountryFlag
            countryCode={country.iso_2.toUpperCase()}
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
