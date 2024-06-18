import { HttpTypes } from "@medusajs/types"
import ReactCountryFlag from "react-country-flag"

type TaxRegionListItemProps = {
  taxRegion: HttpTypes.AdminTaxRegion
}

export const TaxRegionListItem = ({ taxRegion }: TaxRegionListItemProps) => {
  const { country_code, name, is_combinable, rate } = taxRegion

  return (
    <div>
      <div>
        <ReactCountryFlag countryCode={country_code} />
      </div>
    </div>
  )
}
