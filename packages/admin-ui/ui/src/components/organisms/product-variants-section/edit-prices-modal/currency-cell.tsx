import React, { forwardRef, useEffect, useRef, useState } from "react"
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

  onDragFillStart: (
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void

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

const currencyInput = forwardRef((props, ref) => <input ref={ref} {...props} />)
const currencySpan = forwardRef((props, ref) => (
  <span ref={ref} {...props}>
    {props.value || props.placeholder}
  </span>
))

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

  const ref = useRef()

  const currencyMeta = useCurrencyMeta(currencyCode, region)
  const [isEditable, setIsEditable] = useState(false)

  const [localValue, setLocalValue] = useState({
    value: editedAmount,
    float: editedAmount,
  })

  useEffect(() => {
    setLocalValue({
      value: editedAmount?.toFixed(currencyMeta?.decimal_digits) || "",
      float: editedAmount,
    })
  }, [editedAmount])

  useEffect(() => {
    if (!isSelected) {
      setIsEditable(false)
    }

    if (isSelected && isAnchor) {
      const onkeydown = (e) => {
        if (document.activeElement?.tagName === "INPUT") {
          return
        }

        if (!isNaN(Number(e.key))) {
          setLocalValue({
            float: Number(e.key),
            value: String(e.key),
          })
          setIsEditable(true)
        }
      }

      document.addEventListener("keydown", onkeydown)
      return () => document.removeEventListener("keydown", onkeydown)
    }
  }, [isSelected, isAnchor, ref.current])

  useEffect(() => {
    if (isEditable) {
      /**
       * HACK - for some reason focusing input will cause `react-currency-input-field` to double the digit that is set as value
       * If we use set timout it will work as expected.
       */
      setTimeout(() => ref.current.focus())
    } else {
      // Format value back after edit
      setLocalValue({
        value: localValue.float?.toFixed(currencyMeta?.decimal_digits) || "",
        float: localValue.float,
      })
      props.onInputChange(localValue.float, variant.id, currencyCode, region) // notify parent container about the change
    }
  }, [isEditable])

  return (
    <td
      onMouseDown={(e) => {
        if (!isEditable) {
          e.stopPropagation()
          e.preventDefault()
        }

        props.onMouseCellClick(e, variant.id, currencyCode, region)

        if (e.detail === 2) {
          // Unformat value for edit
          setLocalValue({
            float: localValue.float,
            value: String(localValue.float || ""),
          })
          setIsEditable(true)
        }
      }}
      className={clsx("relative cursor-pointer pr-2 pl-4", {
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
          ref={ref}
          onBlurCapture={() => {
            setIsEditable(false)
          }}
          style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
          className={clsx("decoration-transparent focus:outline-0", {
            "bg-blue-100": isSelected && !isAnchor,
          })}
          onValueChange={(_a, _b, v) => setLocalValue(v)}
          allowDecimals={currencyMeta?.decimal_digits > 0}
          decimalScale={isEditable ? undefined : currencyMeta?.decimal_digits}
          allowNegativeValue={false}
          value={localValue.value}
          decimalSeparator="."
          placeholder="-"
          customInput={isEditable ? currencyInput : currencySpan}
        />
        {isRangeEnd && !isEditable && (
          <div
            style={{ bottom: -4, right: -4, zIndex: 9999 }}
            onMouseDown={(event) => {
              document.body.style.userSelect = "none"
              event.stopPropagation()
              props.onDragFillStart(variant.id, currencyCode, region)
            }}
            className="absolute h-2 w-2 cursor-ns-resize rounded-full bg-blue-400"
          />
        )}
      </div>
    </td>
  )
}

export default CurrencyCell
