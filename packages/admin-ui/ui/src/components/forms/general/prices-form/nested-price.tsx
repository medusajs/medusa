import clsx from "clsx"
import { Controller } from "react-hook-form"
import { NestedPriceObject, PricesFormType } from "."
import useToggleState from "../../../../hooks/use-toggle-state"
import { currencies } from "../../../../utils/currencies"
import { NestedForm } from "../../../../utils/nested-form"
import IncludesTaxTooltip from "../../../atoms/includes-tax-tooltip"
import CoinsIcon from "../../../fundamentals/icons/coins-icon"
import MapPinIcon from "../../../fundamentals/icons/map-pin-icon"
import TriangleRightIcon from "../../../fundamentals/icons/triangle-right-icon"
import PriceFormInput from "./price-form-input"

type Props = {
  form: NestedForm<PricesFormType>
  nestedPrice: NestedPriceObject
}

const NestedPrice = ({ form, nestedPrice }: Props) => {
  const { state, toggle } = useToggleState()

  const { control, path } = form
  const { currencyPrice, regionPrices } = nestedPrice
  return (
    <div className="gap-y-2xsmall flex flex-col">
      <div className="gap-x-base p-2xsmall hover:bg-grey-5 focus-within:bg-grey-5 rounded-rounded relative grid grid-cols-[1fr_223px] justify-between pl-10 transition-colors">
        <button
          className={clsx(
            "left-xsmall text-grey-40 absolute top-1/2 -translate-y-1/2 transition-all",
            {
              "rotate-90": state,
            },
            {
              hidden: regionPrices.length === 0,
            }
          )}
          type="button"
          onClick={toggle}
          disabled={regionPrices.length === 0}
        >
          <TriangleRightIcon />
        </button>
        <div className="gap-x-small flex items-center">
          <div className="bg-grey-10 rounded-rounded text-grey-50 flex h-10 w-10 items-center justify-center">
            <CoinsIcon size={20} />
          </div>
          <div className="gap-x-xsmall flex items-center">
            <span className="inter-base-semibold">
              {currencyPrice.currency_code.toUpperCase()}
            </span>
            <span className="inter-base-regular text-grey-50">
              {currencies[currencyPrice.currency_code.toUpperCase()].name}
            </span>
            <IncludesTaxTooltip includesTax={currencyPrice?.includes_tax} />
          </div>
        </div>
        <Controller
          name={path(`prices.${currencyPrice.index}.amount`)}
          control={control}
          render={({ field: { value, onChange }, formState: { errors } }) => {
            return (
              <PriceFormInput
                onChange={onChange}
                amount={value !== null ? value : undefined}
                currencyCode={currencyPrice.currency_code}
                errors={errors}
              />
            )
          }}
        />
      </div>
      <ul
        className={clsx(
          "gap-y-2xsmall my-2xsmall flex flex-col overflow-hidden",
          {
            "max-h-0": !state,
            "max-h-[9999px]": state,
          }
        )}
      >
        {regionPrices.map((rp) => {
          return (
            <div
              className="p-2xsmall hover:bg-grey-5 focus-within:bg-grey-5 rounded-rounded grid grid-cols-[1fr_223px] justify-between pl-10 transition-colors"
              key={rp.id}
            >
              <div className="gap-x-small flex items-center">
                <div className="bg-grey-10 rounded-rounded text-grey-50 flex h-10 w-10 items-center justify-center">
                  <MapPinIcon size={20} />
                </div>
                <div className="gap-x-xsmall flex items-center">
                  <span className="inter-base-regular text-grey-50">
                    {rp.regionName}
                  </span>
                  <IncludesTaxTooltip includesTax={rp.includes_tax} />
                </div>
              </div>
              <Controller
                name={path(`prices.${rp.index}.amount`)}
                control={control}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => {
                  return (
                    <PriceFormInput
                      onChange={onChange}
                      amount={value !== null ? value : undefined}
                      currencyCode={currencyPrice.currency_code}
                      errors={errors}
                    />
                  )
                }}
              />
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default NestedPrice
