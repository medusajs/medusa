import { Select, clx } from "@medusajs/ui"
import { Controller } from "react-hook-form"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

interface DataGridSelectCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  options: { label: string; value: string }[]
}

export const DataGridSelectCell = <TData, TValue = any>({
  context,
  options,
  field,
}: DataGridSelectCellProps<TData, TValue>) => {
  const { control, attributes, container } = useDataGridCell({
    field,
    context,
  })

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { onChange, ref, ...field } }) => {
        return (
          <DataGridCellContainer {...container}>
            <Select {...field} onValueChange={onChange}>
              <Select.Trigger
                {...attributes}
                ref={ref}
                className={clx(
                  "h-full w-full rounded-none bg-transparent px-4 py-2.5 shadow-none",
                  "hover:bg-transparent focus:shadow-none data-[state=open]:!shadow-none"
                )}
              >
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {options.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </DataGridCellContainer>
        )
      }}
    />
  )
}
