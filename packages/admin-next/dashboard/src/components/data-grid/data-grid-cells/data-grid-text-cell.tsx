import { clx } from "@medusajs/ui"
import { Controller } from "react-hook-form"

import { useDataGridCell } from "../hooks"
import { DataGridCellContext, DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridTextCell = <TData, TValue = any>({
  field,
  context,
}: DataGridCellProps<TData, TValue>) => {
  const { row, columnIndex } = context as DataGridCellContext<TData, TValue>

  const { control, attributes, container } = useDataGridCell({
    row: row.index,
    col: columnIndex,
  })

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <DataGridCellContainer {...container}>
            <input
              className={clx(
                "txt-compact-small text-ui-fg-subtle flex size-full cursor-pointer items-center justify-center bg-transparent px-4 py-2.5 outline-none",
                "focus:cursor-text"
              )}
              tabIndex={-1}
              {...attributes}
              {...field}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}
