import { FieldValues } from "react-hook-form"

import {
  DataGridBooleanCell,
  DataGridCurrencyCell,
  DataGridNumberCell,
  DataGridReadOnlyCell,
  DataGridRoot,
  DataGridSkeleton,
  DataGridTextCell,
  type DataGridRootProps,
} from "./components"

interface DataGridProps<TData, TFieldValues extends FieldValues = FieldValues>
  extends DataGridRootProps<TData, TFieldValues> {
  isLoading?: boolean
}

const _DataGrid = <TData, TFieldValues extends FieldValues = FieldValues>({
  isLoading,
  ...props
}: DataGridProps<TData, TFieldValues>) => {
  return isLoading ? (
    <DataGridSkeleton
      columns={props.columns}
      rows={
        props.data?.length && props.data.length > 0 ? props.data.length : 10
      }
    />
  ) : (
    <DataGridRoot {...props} />
  )
}

export const DataGrid = Object.assign(_DataGrid, {
  BooleanCell: DataGridBooleanCell,
  TextCell: DataGridTextCell,
  NumberCell: DataGridNumberCell,
  CurrencyCell: DataGridCurrencyCell,
  ReadonlyCell: DataGridReadOnlyCell,
})
