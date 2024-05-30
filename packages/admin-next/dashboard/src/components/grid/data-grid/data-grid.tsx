import { FieldValues } from "react-hook-form"
import { DataGridRoot, DataGridRootProps } from "./data-grid-root"
import { DataGridSkeleton } from "./data-grid-skeleton"

interface DataGridProps<TData, TFieldValues extends FieldValues = any>
  extends DataGridRootProps<TData, TFieldValues> {
  isLoading?: boolean
}

export const DataGrid = <TData, TFieldValues extends FieldValues = any>({
  isLoading,
  ...props
}: DataGridProps<TData, TFieldValues>) => {
  return isLoading ? (
    <DataGridSkeleton columns={props.columns} rowCount={10} />
  ) : (
    <DataGridRoot {...props} />
  )
}
