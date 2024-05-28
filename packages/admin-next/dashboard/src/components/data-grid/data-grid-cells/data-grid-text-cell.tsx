import { clx } from "@medusajs/ui"
import { Controller } from "react-hook-form"

import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

export const DataGridTextCell = <TData, TValue = any>({
  field,
  context,
}: DataGridCellProps<TData, TValue>) => {
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
            <input
              className={clx(
                "txt-compact-small text-ui-fg-subtle flex size-full cursor-pointer items-center justify-center bg-transparent px-4 py-2.5 outline-none",
                "focus:cursor-text"
              )}
              autoComplete="off"
              tabIndex={-1}
              value={value}
              onChange={(e) => onChange(e.target.value, value)}
              {...attributes}
              {...field}
            />
          </DataGridCellContainer>
        )
      }}
    />
  )
}
