import { FieldValues } from "react-hook-form"

import {
  DataGridBooleanCell,
  DataGridCurrencyCell,
  DataGridMultilineCell,
  DataGridNumberCell,
  DataGridReadOnlyCell,
  DataGridRoot,
  DataGridSkeleton,
  DataGridTextCell,
  DataGridExpandableTextCell,
  type DataGridRootProps,
} from "./components"

interface DataGridProps<TData, TFieldValues extends FieldValues = FieldValues>
  extends DataGridRootProps<TData, TFieldValues> {
  isLoading?: boolean
}

const _DataGrid = <TData, TFieldValues extends FieldValues = FieldValues>({
  isLoading,
  // Lazy loading props - passed through to DataGridRoot
  totalRowCount,
  onFetchMore,
  isFetchingMore,
  hasNextPage,
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
    <DataGridRoot
      {...props}
      totalRowCount={totalRowCount}
      onFetchMore={onFetchMore}
      isFetchingMore={isFetchingMore}
      hasNextPage={hasNextPage}
    />
  )
}

export const DataGrid = Object.assign(_DataGrid, {
  BooleanCell: DataGridBooleanCell,
  TextCell: DataGridTextCell,
  MultilineCell: DataGridMultilineCell,
  ExpandableTextCell: DataGridExpandableTextCell,
  NumberCell: DataGridNumberCell,
  CurrencyCell: DataGridCurrencyCell,
  ReadonlyCell: DataGridReadOnlyCell,
})
