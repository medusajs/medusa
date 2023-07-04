import useToggleState from "../../../hooks/use-toggle-state"
import { currencies } from "../../../utils/currencies"
import Button from "../../fundamentals/button"
import EyeIcon from "../../fundamentals/icons/eye-icon"
import EyeOffIcon from "../../fundamentals/icons/eye-off-icon"
import MedusaPriceInput from "../../organisms/medusa-price-input"

const PriceAmount = ({ value, onChange }) => {
  const { state: showRegions, toggle } = useToggleState()

  const currencyName = currencies[value.currency_code?.toUpperCase()]?.name
  return (
    <div className="border-grey-20 flex flex-col gap-3 border-b border-solid py-3 first:border-t last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inter-base-semibold">
            <span className="mr-2 uppercase">{value.currency_code}</span>
            <span className="inter-base-regular text-grey-50 capitalize">
              {currencyName}
            </span>
          </div>
          {value.region?.countries ? (
            <Button
              variant="secondary"
              size="small"
              className="rounded-rounded h-[32px]"
              onClick={toggle}
            >
              <div className="flex items-center gap-2">
                {showRegions ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                <span>Show regions</span>
              </div>
            </Button>
          ) : null}
        </div>
        <div className="basis-[220px]">
          <MedusaPriceInput
            amount={value.amount}
            onChange={onChange}
            currency={currencies[value.currency_code.toUpperCase()]}
          />
        </div>
      </div>

      {/* missing core support */}
      {/* {showRegions && (
        <ul>
          {value.region?.countries.map((country) => (
            <li key={country.id} className="flex items-center justify-between">
              <div>
                <p className="inter-base-regular text-grey-50">
                  {country.display_name}
                </p>
              </div>
              <div className="basis-[220px]">
                <PriceInput
                  amount={600}
                  currency={{
                    code: "eur",
                    name: "Euro",
                    decimal_digits: 2,
                    symbol: "€",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  )
}

export default PriceAmount
