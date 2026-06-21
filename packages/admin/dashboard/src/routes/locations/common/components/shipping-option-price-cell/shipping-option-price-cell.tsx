import { ArrowsPointingOut, CircleSliders } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useCallback, useEffect, useRef, useState } from "react"
import CurrencyInput, {
  CurrencyInputProps,
  formatValue,
} from "react-currency-input-field"
import {
  Control,
  Controller,
  ControllerRenderProps,
  useWatch,
} from "react-hook-form"
import { DataGridCellContainer } from "../../../../../components/data-grid/components/data-grid-cell-container"
import {
  useDataGridCell,
  useDataGridCellError,
} from "../../../../../components/data-grid/hooks"
import {
  DataGridCellProps,
  InputProps,
} from "../../../../../components/data-grid/types"
import { useCombinedRefs } from "../../../../../hooks/use-combined-refs"
import { currencies, CurrencyInfo } from "../../../../../lib/data/currencies"
import { getCustomShippingOptionPriceFieldName } from "../../utils/get-custom-shipping-option-price-field-info"
import { useShippingOptionPrice } from "../shipping-option-price-provider"

interface ShippingOptionPriceCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
  header: string
  type: "currency" | "region"
}

export const ShippingOptionPriceCell = <TData, TValue = any>({
  context,
  code,
  header,
  type,
}: ShippingOptionPriceCellProps<TData, TValue>) => {
  const [symbolWidth, setSymbolWidth] = useState(0)

  const measuredRef = useCallback((node: HTMLSpanElement) => {
    if (node) {
      const width = node.offsetWidth
      setSymbolWidth(width)
    }
  }, [])

  const { field, control, renderProps } = useDataGridCell({
    context,
  })

  const errorProps = useDataGridCellError({ context })

  const { container, input } = renderProps
  const { isAnchor } = container

  const currency = currencies[code.toUpperCase()]

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: props }) => {
        return (
          <DataGridCellContainer
            {...container}
            {...errorProps}
            outerComponent={
              <OuterComponent
                header={header}
                isAnchor={isAnchor}
                field={field}
                control={control}
                symbolWidth={symbolWidth}
                type={type}
                currency={currency}
              />
            }
          >
            <Inner
              field={props}
              inputProps={input}
              currencyInfo={currency}
              onMeasureSymbol={measuredRef}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const OuterComponent = ({
  isAnchor,
  header,
  field,
  control,
  symbolWidth,
  type,
  currency,
}: {
  isAnchor: boolean
  header: string
  field: string
  control: Control<any>
  symbolWidth: number
  type: "currency" | "region"
  currency: CurrencyInfo
}) => {
  const { onOpenConditionalPricesModal } = useShippingOptionPrice()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const name = getCustomShippingOptionPriceFieldName(field, type)
  const price = useWatch({ control, name })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnchor && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault()
        buttonRef.current?.click()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAnchor])

  return (
    <div
      className="absolute inset-y-0 z-[3] flex w-fit items-center justify-center"
      style={{
        left: symbolWidth ? `${symbolWidth + 16 + 4}px` : undefined,
      }}
    >
      {price?.length > 0 && !isAnchor && (
        <div className="flex size-[15px] items-center justify-center group-hover/container:hidden">
          <CircleSliders className="text-ui-fg-interactive" />
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        className={clx(
          "hover:text-ui-fg-subtle text-ui-fg-muted transition-fg hidden size-[15px] items-center justify-center rounded-md bg-transparent group-hover/container:flex",
          { flex: isAnchor }
        )}
        onClick={() =>
          onOpenConditionalPricesModal({
            type,
            field,
            currency,
            name: header,
          })
        }
      >
        <ArrowsPointingOut />
      </button>
    </div>
  )
}

const Inner = ({
  field,
  onMeasureSymbol,
  inputProps,
  currencyInfo,
}: {
  field: ControllerRenderProps<any, string>
  onMeasureSymbol: (node: HTMLSpanElement) => void
  inputProps: InputProps
  currencyInfo: CurrencyInfo
}) => {
  const { value, onChange: _, onBlur, ref, ...rest } = field
  const {
    ref: inputRef,
    onBlur: onInputBlur,
    onFocus,
    onChange,
    ...attributes
  } = inputProps

  const formatter = useCallback(
    (value?: string | number) => {
      const ensuredValue =
        typeof value === "number" ? value.toString() : value || ""

      return formatValue({
        value: ensuredValue,
        decimalScale: currencyInfo.decimal_digits,
        disableGroupSeparators: true,
        decimalSeparator: ".",
      })
    },
    [currencyInfo]
  )

  const [localValue, setLocalValue] = useState<string | number>(value ?? "")

  const handleValueChange: CurrencyInputProps["onValueChange"] = (
    value,
    _name,
    _values
  ) => {
    if (!value) {
      setLocalValue("")
      return
    }

    setLocalValue(value)
  }

  useEffect(() => {
    let update = value

    // The component we use is a bit fidly when the value is updated externally
    // so we need to ensure a format that will result in the cell being formatted correctly
    // according to the users locale on the next render.
    if (!isNaN(Number(value))) {
      update = formatter(update)
    }

    setLocalValue(update)
  }, [value, formatter])

  const combinedRed = useCombinedRefs(inputRef, ref)

  return (
    <div className="relative flex size-full items-center">
      <span
        className="txt-compact-small text-ui-fg-muted pointer-events-none absolute left-0 w-fit min-w-4"
        aria-hidden
        ref={onMeasureSymbol}
      >
        {currencyInfo.symbol_native}
      </span>
      <CurrencyInput
        {...rest}
        {...attributes}
        ref={combinedRed}
        className="txt-compact-small w-full flex-1 cursor-default appearance-none bg-transparent pl-[60px] text-right outline-none"
        value={localValue || undefined}
        onValueChange={handleValueChange}
        formatValueOnBlur
        onBlur={() => {
          onBlur()
          onInputBlur()

          onChange(localValue, value)
        }}
        onFocus={onFocus}
        decimalScale={currencyInfo.decimal_digits}
        decimalsLimit={currencyInfo.decimal_digits}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  )
}
