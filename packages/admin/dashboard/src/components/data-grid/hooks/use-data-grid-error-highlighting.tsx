import { Table, VisibilityState } from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"
import { FieldError, FieldErrors, FieldValues } from "react-hook-form"

import { DataGridMatrix } from "../models"
import { VisibilitySnapshot } from "../types"

export const useDataGridErrorHighlighting = <
  TData,
  TFieldValues extends FieldValues
>(
  matrix: DataGridMatrix<TData, TFieldValues>,
  grid: Table<TData>,
  errors: FieldErrors<TFieldValues>
) => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false)
  const [visibilitySnapshot, setVisibilitySnapshot] =
    useState<VisibilitySnapshot | null>(null)

  const { flatRows } = grid.getRowModel()
  const flatColumns = grid.getAllFlatColumns()

  const errorPaths = findErrorPaths(errors)
  const errorCount = errorPaths.length

  const { rowsWithErrors, columnsWithErrors } = useMemo(() => {
    const rowsWithErrors = new Set<number>()
    const columnsWithErrors = new Set<number>()

    errorPaths.forEach((errorPath) => {
      const rowIndex = matrix.rowAccessors.findIndex(
        (accessor) =>
          accessor &&
          (errorPath === accessor || errorPath.startsWith(`${accessor}.`))
      )
      if (rowIndex !== -1) {
        rowsWithErrors.add(rowIndex)
      }

      const columnIndex = matrix.columnAccessors.findIndex(
        (accessor) =>
          accessor &&
          (errorPath === accessor || errorPath.endsWith(`.${accessor}`))
      )
      if (columnIndex !== -1) {
        columnsWithErrors.add(columnIndex)
      }
    })

    return { rowsWithErrors, columnsWithErrors }
  }, [errorPaths, matrix.rowAccessors, matrix.columnAccessors])

  const toggleErrorHighlighting = useCallback(
    (
      currentRowVisibility: VisibilityState,
      currentColumnVisibility: VisibilityState,
      setRowVisibility: (visibility: VisibilityState) => void,
      setColumnVisibility: (visibility: VisibilityState) => void
    ) => {
      if (isHighlighted) {
        // Clear error highlights
        if (visibilitySnapshot) {
          setRowVisibility(visibilitySnapshot.rows)
          setColumnVisibility(visibilitySnapshot.columns)
        }
      } else {
        // Highlight errors
        setVisibilitySnapshot({
          rows: { ...currentRowVisibility },
          columns: { ...currentColumnVisibility },
        })

        const rowsToHide = flatRows
          .map((_, index) => {
            return !rowsWithErrors.has(index) ? index : undefined
          })
          .filter((index): index is number => index !== undefined)

        const columnsToHide = flatColumns
          .map((column, index) => {
            return !columnsWithErrors.has(index) && index !== 0
              ? column.id
              : undefined
          })
          .filter((id): id is string => id !== undefined)

        setRowVisibility(
          rowsToHide.reduce((acc, row) => ({ ...acc, [row]: false }), {})
        )

        setColumnVisibility(
          columnsToHide.reduce(
            (acc, column) => ({ ...acc, [column]: false }),
            {}
          )
        )
      }

      setIsHighlighted((prev) => !prev)
    },
    [
      isHighlighted,
      visibilitySnapshot,
      flatRows,
      flatColumns,
      rowsWithErrors,
      columnsWithErrors,
    ]
  )

  return {
    errorCount,
    isHighlighted,
    toggleErrorHighlighting,
  }
}

function findErrorPaths(
  obj: FieldErrors | FieldError,
  path: string[] = []
): string[] {
  if (typeof obj !== "object" || obj === null) {
    return []
  }

  if ("message" in obj && "type" in obj) {
    return [path.join(".")]
  }

  return Object.entries(obj).flatMap(([key, value]) =>
    findErrorPaths(value, [...path, key])
  )
}
