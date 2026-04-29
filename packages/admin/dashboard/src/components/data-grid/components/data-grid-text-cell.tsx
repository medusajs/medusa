import { clx } from "@medusajs/ui"
import { useEffect, useRef, useState } from "react"
import { Controller, ControllerRenderProps } from "react-hook-form"

import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { useDataGridCell, useDataGridCellError } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridTextCell = <TData, TValue = any>({
  context,
}: DataGridCellProps<TData, TValue>) => {
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
            <Inner field={field} inputProps={input} />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
}) => {
  const { onChange: _, onBlur, ref, value, ...rest } = field
  const { ref: inputRef, onBlur: onInputBlur, onChange, ...input } = inputProps

  const [localValue, setLocalValue] = useState(value)
  const inputElRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const combinedRefs = useCombinedRefs(inputRef, ref, inputElRef)

  return (
    <input
      className={clx(
        "txt-compact-small text-ui-fg-subtle flex size-full cursor-pointer bg-transparent outline-none",
        "focus:cursor-text",
        "items-center justify-center"
      )}
      autoComplete="off"
      tabIndex={-1}
      value={localValue ?? ""}
      onChange={(e) => setLocalValue(e.target.value)}
      ref={combinedRefs}
      onBlur={() => {
        onBlur()
        onInputBlur()
        onChange(localValue, value)
      }}
      {...input}
      {...rest}
    />
  )
}
