import type { Column, Table } from "@tanstack/react-table"
import { useCallback } from "react"
import type { FieldValues } from "react-hook-form"

import { DataGridMatrix } from "../models"
import { GridColumnOption } from "../types"

export function useDataGridColumnVisibility<
  TData,
  TFieldValues extends FieldValues
>(grid: Table<TData>, matrix: DataGridMatrix<TData, TFieldValues>) {
  const columns = grid.getAllLeafColumns()

  const columnOptions: GridColumnOption[] = columns.map((column) => ({
    id: column.id,
    name: getColumnName(column),
    checked: column.getIsVisible(),
    disabled: !column.getCanHide(),
  }))

  const handleToggleColumn = useCallback(
    (index: number) => (value: boolean) => {
      const column = columns[index]

      if (!column.getCanHide()) {
        return
      }

      matrix.toggleColumn(index, value)
      column.toggleVisibility(value)
    },
    [columns, matrix]
  )

  const handleResetColumns = useCallback(() => {
    grid.setColumnVisibility({})
  }, [grid])

  const optionCount = columnOptions.filter((c) => !c.disabled).length
  const isDisabled = optionCount === 0

  return {
    columnOptions,
    handleToggleColumn,
    handleResetColumns,
    isDisabled,
  }
}

function getColumnName<TData>(column: Column<TData, unknown>): string {
  const id = column.columnDef.id
  const enableHiding = column.columnDef.enableHiding
  const meta = column?.columnDef.meta as { name?: string } | undefined

  if (!id) {
    throw new Error(
      "Column is missing an id, which is a required field. Please provide an id for the column."
    )
  }

  if (process.env.NODE_ENV === "development" && !meta?.name && enableHiding) {
    console.warn(
      `Column "${id}" does not have a name. You should add a name to the column definition. Falling back to the column id.`
    )
  }

  return meta?.name || id
}
