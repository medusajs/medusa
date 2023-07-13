import React, { useEffect, useState } from "react"
import { ProductVariant } from "@medusajs/client-types"
import AmountField from "react-currency-input-field"
import clsx from "clsx"

import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import { useAdminRegions } from "medusa-react"

function useCurrencyMeta(
  currencyCode: string | undefined,
  regionId: string | undefined
) {
  const { regions } = useAdminRegions()
  if (currencyCode) {
    return CURRENCY_MAP[currencyCode?.toUpperCase()]
  }

  if (regions) {
    const region = regions.find((r) => r.id === regionId)
    return CURRENCY_MAP[region!.currency_code.toUpperCase()]
  }
}

type CurrencyCellProps = {
  currencyCode?: string
  region?: string

  variant: ProductVariant
  editedAmount?: number
  isSelected?: boolean
  isAnchor?: boolean

  isRangeStart: boolean
  isRangeEnd: boolean
  isInRange: boolean

  onDragStart: (
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void
  onDragEnd: () => void

  onMouseCellClick: (
    event: React.MouseEvent,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void

  onInputChange: (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string,
    persist?: boolean
  ) => void
}

/**
 * Amount cell container.
 */
function CurrencyCell(props: CurrencyCellProps) {
  const {
    variant,
    currencyCode,
    region,
    editedAmount,
    isSelected,
    isAnchor,
    isInRange,
    isRangeStart,
    isRangeEnd,
  } = props

  const currencyMeta = useCurrencyMeta(currencyCode, region)

  const [localValue, setLocalValue] = useState({
    value: editedAmount,
    float: editedAmount,
  })

  useEffect(() => {
    setLocalValue({ value: editedAmount || "", float: editedAmount })
  }, [editedAmount])

  return (
    <td
      onMouseDown={(e) =>
        props.onMouseCellClick(e, variant.id, currencyCode, region)
      }
      className={clsx("relative pr-2 pl-4", {
        border: !isInRange,
        "bg-blue-100": isSelected && !isAnchor,
        "border-x border-double border-blue-400": isInRange,
        "border-t border-blue-400": isRangeStart,
        "border-b border-blue-400": isRangeEnd,
      })}
    >
      <div className="flex">
        <span className="text-gray-400">{currencyMeta?.symbol_native}</span>
        <AmountField
          onBlur={() => {
            props.onInputChange(
              localValue.float,
              variant.id,
              currencyCode,
              region
            )
          }}
          style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
          className={clsx("decoration-transparent focus:outline-0", {
            "bg-blue-100": isSelected && !isAnchor,
          })}
          onValueChange={(_a, _b, v) => setLocalValue(v)}
          decimalsLimit={currencyMeta?.decimal_digits || 2}
          fixedDecimalLength={currencyMeta?.decimal_digits || 2}
          decimalScale={currencyMeta?.decimal_digits || 2}
          allowNegativeValue={false}
          decimalSeparator="."
          // placeholder="-"
          value={localValue.value}
        ></AmountField>
        {isRangeEnd && (
          <div
            style={{ bottom: -4, right: -4, zIndex: 9999 }}
            onMouseDown={(event) => {
              document.body.style.userSelect = "none"
              event.stopPropagation()
              props.onInputChange(
                localValue.float,
                variant.id,
                currencyCode,
                region,
                true
              )
              props.onDragStart(variant.id, currencyCode, region)
            }}
            className="absolute h-2 w-2 cursor-ns-resize rounded-full bg-blue-400"
          />
        )}
      </div>
    </td>
  )
}

export default CurrencyCell
