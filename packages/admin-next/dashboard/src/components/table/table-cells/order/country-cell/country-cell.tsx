import ReactCountryFlag from "react-country-flag"
import { PlaceholderCell } from "../../common/placeholder-cell"

export const CountryCell = ({
  countryCode,
}: {
  countryCode?: string | null
}) => {
  if (!countryCode) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-5 items-center justify-center">
      <div className="flex size-4 items-center justify-center overflow-hidden rounded-sm">
        <ReactCountryFlag
          countryCode={countryCode.toUpperCase()}
          svg
          style={{
            width: "16px",
            height: "16px",
          }}
          aria-label={countryCode}
        />
      </div>
    </div>
  )
}
