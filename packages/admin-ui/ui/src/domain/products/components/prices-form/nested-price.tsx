import clsx from "clsx"
import React from "react"
import { Controller } from "react-hook-form"
import { NestedPriceObject, PricesFormType } from "."
import IncludesTaxTooltip from "../../../../components/atoms/includes-tax-tooltip"
import CoinsIcon from "../../../../components/fundamentals/icons/coins-icon"
import MapPinIcon from "../../../../components/fundamentals/icons/map-pin-icon"
import TriangleRightIcon from "../../../../components/fundamentals/icons/triangle-right-icon"
import useToggleState from "../../../../hooks/use-toggle-state"
import { currencies } from "../../../../utils/currencies"
import { NestedForm } from "../../../../utils/nested-form"
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
    <div key={currencyPrice.id} className="flex flex-col gap-y-2xsmall">
      <div className="relative grid grid-cols-[1fr_223px] gap-x-base p-2xsmall pl-10 hover:bg-grey-5 focus-within:bg-grey-5 transition-colors rounded-rounded justify-between">
        <button
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 left-xsmall text-grey-40 transition-all",
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
        <div className="flex items-center gap-x-small">
          <div className="w-10 h-10 bg-grey-10 rounded-rounded text-grey-50 flex items-center justify-center">
            <CoinsIcon size={20} />
          </div>
          <div className="flex items-center gap-x-xsmall">
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
          "flex flex-col gap-y-2xsmall my-2xsmall overflow-hidden",
          {
            "max-h-0": !state,
            "max-h-[9999px]": state,
          }
        )}
      >
        {regionPrices.map((rp) => {
          return (
            <div
              className="grid grid-cols-[1fr_223px] p-2xsmall pl-10 hover:bg-grey-5 focus-within:bg-grey-5 transition-colors rounded-rounded justify-between"
              key={rp.id}
            >
              <div className="flex items-center gap-x-small">
                <div className="w-10 h-10 bg-grey-10 rounded-rounded text-grey-50 flex items-center justify-center">
                  <MapPinIcon size={20} />
                </div>
                <div className="flex items-center gap-x-xsmall">
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
