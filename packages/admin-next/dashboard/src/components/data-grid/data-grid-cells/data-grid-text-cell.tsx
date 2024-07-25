import { clx } from "@medusajs/ui"
import { Controller, ControllerRenderProps } from "react-hook-form"

import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridTextCell = <TData, TValue = any>({
  field,
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { control, renderProps } = useDataGridCell({
    field,
    context,
    type: "text",
  })

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container}>
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
  const { onChange, onBlur, ref, ...rest } = field
  const { ref: inputRef, onBlur: onInputBlur, ...input } = inputProps

  const combinedRefs = useCombinedRefs(inputRef, ref)

  return (
    <input
      className={clx(
        "txt-compact-small text-ui-fg-subtle flex size-full cursor-pointer items-center justify-center bg-transparent px-4 py-2.5 outline-none",
        "focus:cursor-text"
      )}
      autoComplete="off"
      tabIndex={-1}
      onChange={(e) => onChange(e.target.value)}
      ref={combinedRefs}
      onBlur={() => {
        onBlur()
        onInputBlur()
      }}
      {...input}
      {...rest}
    />
  )
}
