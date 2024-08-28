import { clx } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Controller, ControllerRenderProps } from "react-hook-form"
import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { useDataGridCell, useDataGridCellError } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridNumberCell = <TData, TValue = any>({
  context,
  ...rest
}: DataGridCellProps<TData, TValue> & {
  min?: number
  max?: number
  placeholder?: string
}) => {
  const { field, control, renderProps } = useDataGridCell({
    context,
  })
  const errorProps = useDataGridCellError({ context })

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container} {...errorProps}>
            <Inner field={field} inputProps={input} {...rest} />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
  ...props
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  min?: number
  max?: number
  placeholder?: string
}) => {
  const { ref, value, onChange: _, onBlur, ...fieldProps } = field
  const {
    ref: inputRef,
    onChange,
    onBlur: onInputBlur,
    onFocus,
    ...attributes
  } = inputProps

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const combinedRefs = useCombinedRefs(inputRef, ref)

  return (
    <div className="size-full">
      <input
        ref={combinedRefs}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => {
          onBlur()
          onInputBlur()

          // We propagate the change to the field only when the input is blurred
          onChange(localValue, value)
        }}
        onFocus={onFocus}
        type="number"
        inputMode="decimal"
        className={clx(
          "txt-compact-small size-full bg-transparent outline-none",
          "placeholder:text-ui-fg-muted"
        )}
        tabIndex={-1}
        {...props}
        {...fieldProps}
        {...attributes}
      />
    </div>
  )
}
