import {
  CellContext,
  ColumnDefTemplate,
  createColumnHelper,
  HeaderContext,
  RowData,
} from "@tanstack/react-table"
import { DataGridFeatures } from "../data-grid-features"
import { FieldValues } from "react-hook-form"

import { DataGridColumnType, FieldFunction } from "../types"

type DataGridHelperColumnsProps<
  TData extends RowData,
  TFieldValues extends FieldValues,
> = {
  /**
   * The id of the column.
   */
  id: string
  /**
   * The name of the column, shown in the column visibility menu.
   */
  name?: string
  /**
   * The header template for the column.
   */
  header:
    | ColumnDefTemplate<HeaderContext<DataGridFeatures, TData, unknown>>
    | undefined
  /**
   * The cell template for the column.
   */
  cell:
    ColumnDefTemplate<CellContext<DataGridFeatures, TData, unknown>> | undefined
  /**
   * Callback to set the field path for each cell in the column.
   * If a callback is not provided, or returns null, the cell will not be editable.
   */
  field?: FieldFunction<TData, TFieldValues>
  /**
   * Whether the column cannot be hidden by the user.
   *
   * @default false
   */
  disableHiding?: boolean
  /**
   * The size of the column in pixels.
   */
  size?: number
  /**
   * The minimum size of the column in pixels.
   */
  minSize?: number
  /**
   * The maximum size of the column in pixels.
   */
  maxSize?: number
} & (
  | {
      field: FieldFunction<TData, TFieldValues>
      type: DataGridColumnType
    }
  | { field?: null | undefined; type?: never }
)

export function createDataGridHelper<
  TData extends RowData,
  TFieldValues extends FieldValues,
>() {
  const columnHelper = createColumnHelper<DataGridFeatures, TData>()

  return {
    column: ({
      id,
      name,
      header,
      cell,
      disableHiding = false,
      field,
      type,
      size,
      minSize,
      maxSize,
    }: DataGridHelperColumnsProps<TData, TFieldValues>) =>
      columnHelper.display({
        id,
        header,
        cell,
        enableHiding: !disableHiding,
        size,
        minSize,
        maxSize,
        meta: {
          name,
          field,
          type,
        },
      }),
  }
}
