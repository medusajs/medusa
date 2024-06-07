import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridNumberCell = <TData, TValue = any>({
  field,
  context,
  min,
  max,
}: DataGridCellProps<TData, TValue> & { min?: number; max?: number }) => {
  const { register, attributes, container } = useDataGridCell({
    field,
    context,
  })

  return (
    <DataGridCellContainer {...container}>
      <input
        {...attributes}
        type="number"
        {...register(field, {
          valueAsNumber: true,
        })}
        className="h-full w-full bg-transparent p-2 text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={min}
        max={max}
      />
    </DataGridCellContainer>
  )
}
