import React, { useState } from "react"

import { ProductVariant } from "@medusajs/client-types"
import { getCurrencyPricesOnly } from "./utils"
import clsx from "clsx"
import AmountField from "react-currency-input-field"

type CellEventHandler = (
  event: React.MouseEvent,
  variantId: string,
  currencyCode?: string,
  regionId?: string
) => void

type CurrencyCellProps = {
  currencyCode?: string
  region?: string

  variant: ProductVariant
  editedAmount?: number
  isSelected?: boolean

  onDragStart: () => void
  onDragEnd: () => void

  onMouseCellEnter: CellEventHandler
  onMouseCellLeave: CellEventHandler
  onMouseCellClick: CellEventHandler
  onInputChange: (
    value: string,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void
}

/**
 * Amount cell container.
 */
function CurrencyCell(props: CurrencyCellProps) {
  const { variant, currencyCode, region, isSelected } = props

  const [showDragIndicator, setShowDragIndicator] = useState<
    number | undefined
  >(false)
  const [localValue, setLocalValue] = useState(() => {
    const price = getCurrencyPricesOnly(variant.prices!).find(
      (p) => p.currency_code === currencyCode || p.region_id === region
    )
    if (price) {
      return price.amount
    }
  })

  return (
    <td
      onMouseDown={(e) =>
        props.onMouseCellClick(e, variant.id, currencyCode, region)
      }
      onMouseEnter={(e) => {
        props.onMouseCellEnter(e, variant.id, currencyCode, region)
      }}
      onMouseLeave={(e) => {
        props.onMouseCellLeave(e, variant.id, currencyCode, region)
      }}
      className={clsx("relative border pr-2", {
        "bg-blue-100": isSelected,
      })}
    >
      <AmountField
        onFocus={() => {
          setShowDragIndicator(true)
        }}
        onBlur={() => {
          setShowDragIndicator(false)
          props.onInputChange(localValue, variant.id, currencyCode, region)
        }}
        style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
        className={clsx("decoration-transparent focus:outline-0", {
          "bg-blue-100": isSelected,
        })}
        onValueChange={(v) => setLocalValue(v?.float)}
        decimalSeparator="."
        value={localValue}
      ></AmountField>
      {showDragIndicator && (
        <div
          onMouseDown={(event) => {
            props.onDragStart()
          }}
          className="absolute right-0 bottom-0 h-2 w-2 cursor-pointer rounded-full bg-blue-400"
        />
      )}
    </td>
  )
}

export default CurrencyCell
