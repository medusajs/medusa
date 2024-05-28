import { Checkbox } from "@medusajs/ui"
import { Controller } from "react-hook-form"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridBooleanCell = <TData, TValue = any>({
  field,
  context,
  disabled,
}: DataGridCellProps<TData, TValue> & { disabled?: boolean }) => {
  const { control, attributes, container, onChange } = useDataGridCell({
    field,
    context,
  })

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange: _, ...field } }) => {
        return (
          <DataGridCellContainer {...container}>
            <Checkbox
              checked={value}
              onCheckedChange={(next) => onChange(next, value)}
              {...field}
              {...attributes}
              disabled={disabled}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}
