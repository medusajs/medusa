import { Checkbox } from "@medusajs/ui"
import { Controller, ControllerRenderProps } from "react-hook-form"
import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps, InputProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridBooleanCell = <TData, TValue = any>({
  field,
  context,
  disabled,
}: DataGridCellProps<TData, TValue> & { disabled?: boolean }) => {
  const { control, renderProps } = useDataGridCell({
    field,
    context,
    type: "select",
  })

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container}>
            <Inner field={field} inputProps={input} disabled={disabled} />
          </DataGridCellContainer>
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
  disabled,
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  disabled?: boolean
}) => {
  const { ref, value, onBlur, name, disabled: fieldDisabled } = field
  const {
    ref: inputRef,
    onBlur: onInputBlur,
    onChange,
    onFocus,
    ...attributes
  } = inputProps

  const combinedRefs = useCombinedRefs(ref, inputRef)

  return (
    <Checkbox
      disabled={disabled || fieldDisabled}
      name={name}
      checked={value}
      onCheckedChange={(newValue) => onChange(newValue === true, value)}
      onFocus={onFocus}
      onBlur={() => {
        onBlur()
        onInputBlur()
      }}
      ref={combinedRefs}
      tabIndex={-1}
      {...attributes}
    />
  )
}
