import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridNumberCell = <TData, TValue = any>({
  field,
  context,
}: DataGridCellProps<TData, TValue>) => {
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
      />
    </DataGridCellContainer>
  )
}
