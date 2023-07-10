import React, { useEffect, useState } from "react"
import { ProductVariant } from "@medusajs/client-types"
import AmountField from "react-currency-input-field"
import clsx from "clsx"

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
  isDragging?: boolean

  onDragStart: () => void
  onDragEnd: () => void

  onMouseCellEnter: CellEventHandler
  onMouseCellLeave: CellEventHandler
  onMouseCellClick: CellEventHandler
  onInputChange: (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string
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
    isDragging,
  } = props

  const [showDragIndicator, setShowDragIndicator] = useState(false)
  const [localValue, setLocalValue] = useState(editedAmount)

  useEffect(() => {
    setLocalValue(editedAmount)
  }, [editedAmount])

  useEffect(() => {
    if (!isDragging) {
      setShowDragIndicator(false)
    }
  }, [isDragging])

  return (
    <td
      onMouseDown={(e) =>
        props.onMouseCellClick(e, variant.id, currencyCode, region)
      }
      onMouseEnter={(e) => {
        if (isDragging) {
          setShowDragIndicator(true)
        }
        props.onMouseCellEnter(e, variant.id, currencyCode, region)
      }}
      onMouseLeave={(e) => {
        if (isDragging) {
          setShowDragIndicator(false)
        }
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
            event.stopPropagation()
            props.onDragStart()
          }}
          className="absolute right-0 bottom-0 h-2 w-2 cursor-pointer rounded-full bg-blue-400"
        />
      )}
    </td>
  )
}

export default CurrencyCell
