"use client"

import type {
  DataTableCellContext,
  DataTableHeaderContext,
  DataTableRowData,
} from "@/blocks/data-table/types"
import { Checkbox, CheckboxCheckedState } from "@/components/checkbox"
import * as React from "react"

interface DataTableSelectCellProps<TData extends DataTableRowData> {
  ctx: DataTableCellContext<TData, unknown>
}

const DataTableSelectCell = <TData extends DataTableRowData>(
  props: DataTableSelectCellProps<TData>
) => {
  const checked = props.ctx.row.getIsSelected()
  const onChange = (checked: CheckboxCheckedState) => {
    props.ctx.row.toggleSelected(!!checked)
  }
  const disabled = !props.ctx.row.getCanSelect()

  return (
    <Checkbox
      onClick={(e) => e.stopPropagation()}
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
    />
  )
}
DataTableSelectCell.displayName = "DataTable.SelectCell"

interface DataTableSelectHeaderProps<TData extends DataTableRowData> {
  ctx: DataTableHeaderContext<TData, unknown>
}

const DataTableSelectHeader = <TData extends DataTableRowData>(
  props: DataTableSelectHeaderProps<TData>
) => {
  const allSelected = props.ctx.table.getIsAllPageRowsSelected()
  const checked =
    !allSelected && props.ctx.table.getIsSomePageRowsSelected()
      ? "indeterminate"
      : allSelected

  const onChange = (checked: CheckboxCheckedState) => {
    props.ctx.table.toggleAllPageRowsSelected(!!checked)
  }
  const disabled = !props.ctx.table
    .getRowModel()
    .rows.some((row) => row.getCanSelect())

  return (
    <Checkbox
      onClick={(e) => e.stopPropagation()}
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
    />
  )
}

export { DataTableSelectCell, DataTableSelectHeader }
export type { DataTableSelectCellProps, DataTableSelectHeaderProps }
