import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridNumberCell = <TData, TValue = any>({
  field,
  context,
  ...rest
}: DataGridCellProps<TData, TValue> & {
  min?: number
  max?: number
  placeholder?: string
}) => {
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
          onChange: (e) => {
            if (e.target.value) {
              return parseInt(e.target.value)
            }
          },
        })}
        className="h-full w-full bg-transparent p-2 text-right [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...rest}
      />
    </DataGridCellContainer>
  )
}
