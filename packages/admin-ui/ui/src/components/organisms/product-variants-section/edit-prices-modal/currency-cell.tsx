import { ProductVariant } from "@medusajs/client-types"
import clsx from "clsx"
import React, { forwardRef, useEffect, useRef, useState } from "react"
import AmountField from "react-currency-input-field"

import { useAdminRegions } from "medusa-react"
import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"

/**
 * Return currency metadata or metadata of region's currency
 */
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

  isRangeStartCol: boolean
  isRangeEndCol: boolean
  isInRangeCol: boolean

  onColumnOver: (currencyOrRegion: string) => void

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
    regionId?: string
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
    onColumnOver,
  } = props

  const ref = useRef()

  const [isEditable, setIsEditable] = useState(false)
  const currencyMeta = useCurrencyMeta(currencyCode, region)

  const [localValue, setLocalValue] = useState({
    value: editedAmount,
    float: editedAmount,
  })

  useEffect(() => {
    setLocalValue({
      // when amount changes with dragging, format received value
      value: editedAmount?.toFixed(currencyMeta?.decimal_digits) || "",
      float: editedAmount,
    })
  }, [editedAmount])

  useEffect(() => {
    if (!isSelected) {
      setIsEditable(false)
    }

    /**
     * Register key listener on selected anchor cell
     */
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
    // when cell becomes editable underlying `span` element is replaced with an `input` which needs to be focused
    if (isEditable) {
      /**
       * HACK - for some reason focusing input will cause `react-currency-input-field` to double the digit that is set as value
       * If we use set timout it will work as expected.
       */
      setTimeout(() => ref.current.focus())

      const onEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          ref.current.blur()
        }
      }

      document.addEventListener("keypress", onEnter)
      return () => document.removeEventListener("keypress", onEnter)
    } else {
      // Format value back after edit
      setLocalValue({
        value: localValue.float?.toFixed(currencyMeta?.decimal_digits) || "",
        float: localValue.float,
      })

      // notify parent container about the change
      props.onInputChange(localValue.float, variant.id, currencyCode, region)
    }
  }, [isEditable])

  /* ==================== HANDLERS ==================== */

  const onCellMouseDown: React.MouseEventHandler = (event) => {
    if (!isEditable) {
      event.stopPropagation()
      event.preventDefault()
    }

    props.onMouseCellClick(event, variant.id, currencyCode, region)

    if (event.detail === 2) {
      // Unformat value for edit
      setLocalValue({
        float: localValue.float,
        value: String(localValue.float || ""),
      })
      setIsEditable(true)
    }
  }

  const onFillIndicatorMouseDown: React.MouseEventHandler = (event) => {
    document.body.style.userSelect = "none"
    event.stopPropagation()
    props.onDragFillStart(variant.id, currencyCode, region)
  }

  const onInputBlurCapture = () => {
    setIsEditable(false)
  }

  return (
    <td
      onMouseOver={() => onColumnOver(currencyCode || region)}
      onMouseDown={onCellMouseDown}
      className={clsx("relative h-10 cursor-pointer border pl-4 pr-2", {
        "bg-blue-100": isSelected && !isAnchor,
      })}
      style={{
        borderTop:
          isRangeStart && props.isInRangeCol ? "1px double #3B82F6" : "",
        borderBottom:
          isRangeEnd && props.isInRangeCol ? "1px double #3B82F6" : "",
        borderLeft:
          props.isRangeStartCol && isInRange ? "1px double #3B82F6" : "",
        borderRight:
          props.isRangeEndCol && isInRange ? "1px double #3B82F6" : "",
      }}
    >
      <div className="flex">
        <span className="text-gray-400">{currencyMeta?.symbol_native}</span>
        <AmountField
          ref={ref}
          onBlurCapture={onInputBlurCapture}
          style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
          className={clsx("decoration-transparent focus:outline-0", {
            "bg-blue-100": isSelected && !isAnchor,
          })}
          onValueChange={(_a, _b, v) => setLocalValue(v)}
          allowDecimals={currencyMeta?.decimal_digits > 0}
          decimalScale={isEditable ? undefined : currencyMeta?.decimal_digits}
          customInput={isEditable ? currencyInput : currencySpan}
          allowNegativeValue={false}
          value={localValue.value}
          placeholder="-"
        />
        {isRangeEnd && props.isRangeEndCol && !isEditable && (
          <div
            style={{ bottom: -4, right: -4, zIndex: 9999 }}
            onMouseDown={onFillIndicatorMouseDown}
            className="absolute h-2 w-2 cursor-ns-resize rounded-full bg-blue-400"
          />
        )}
      </div>
    </td>
  )
}

export default CurrencyCell
