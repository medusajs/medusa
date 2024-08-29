import { Column, Row, VisibilityState } from "@tanstack/react-table"
import { ScrollToOptions, Virtualizer } from "@tanstack/react-virtual"
import { Dispatch, SetStateAction, useCallback } from "react"
import { FieldValues } from "react-hook-form"
import { DataGridMatrix, DataGridQueryTool } from "../models"
import { DataGridCoordinates } from "../types"

type UseDataGridNavigationOptions<TData, TFieldValues extends FieldValues> = {
  matrix: DataGridMatrix<TData, TFieldValues>
  anchor: DataGridCoordinates | null
  visibleRows: Row<TData>[]
  visibleColumns: Column<TData, unknown>[]
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  columnVirtualizer: Virtualizer<HTMLDivElement, Element>
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
  flatColumns: Column<TData, unknown>[]
  queryTool: DataGridQueryTool | null
  setSingleRange: (coords: DataGridCoordinates | null) => void
}

export const useDataGridNavigation = <TData, TFieldValues extends FieldValues>({
  matrix,
  anchor,
  visibleColumns,
  visibleRows,
  columnVirtualizer,
  rowVirtualizer,
  setColumnVisibility,
  flatColumns,
  queryTool,
  setSingleRange,
}: UseDataGridNavigationOptions<TData, TFieldValues>) => {
  const scrollToCoordinates = useCallback(
    (coords: DataGridCoordinates, direction: "horizontal" | "vertical" | "both") => {
      if (!anchor) {
        return
      }

      const { row, col } = coords
      const { row: anchorRow, col: anchorCol } = anchor

      const rowDirection = row >= anchorRow ? "down" : "up"
      const colDirection = col >= anchorCol ? "right" : "left"

      let toRow = rowDirection === "down" ? row + 1 : row - 1
      if (visibleRows[toRow] === undefined) {
        toRow = row
      }

      let toCol = colDirection === "right" ? col + 1 : col - 1
      if (visibleColumns[toCol] === undefined) {
        toCol = col
      }

      const scrollOptions: ScrollToOptions = { align: "auto", behavior: "auto" }

      if (direction === "horizontal" || direction === "both") {
        columnVirtualizer.scrollToIndex(toCol, scrollOptions)
      }

      if (direction === "vertical" || direction === "both") {
        rowVirtualizer.scrollToIndex(toRow, scrollOptions)
      }
    },
    [anchor, columnVirtualizer, visibleRows, rowVirtualizer, visibleColumns]
  )

  const navigateToField = useCallback(
    (field: string) => {
      const coords = matrix.getCoordinatesByField(field)

      if (!coords) {
        return
      }

      const column = flatColumns[coords.col]

      // Ensure that the column is visible
      setColumnVisibility((prev) => {
        return {
          ...prev,
          [column.id]: true,
        }
      })

      requestAnimationFrame(() => {
        scrollToCoordinates(coords, "both")
        setSingleRange(coords)
      })

      requestAnimationFrame(() => {
        const input = queryTool?.getInput(coords)

        if (input) {
          input.focus()
        }
      })
    },
    [
      matrix,
      flatColumns,
      setColumnVisibility,
      scrollToCoordinates,
      setSingleRange,
      queryTool,
    ]
  )

  return {
    scrollToCoordinates,
    navigateToField,
  }
}
