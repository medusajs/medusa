import { CellContext } from "@tanstack/react-table"
import { useContext, useEffect, useMemo } from "react"
import { DataGridContext } from "./context"
import {
  CellCoords,
  DataGridCellContainerProps,
  DataGridCellContext,
} from "./types"
import { generateCellId, isCellMatch } from "./utils"

const useDataGridContext = () => {
  const context = useContext(DataGridContext)

  if (!context) {
    throw new Error(
      "useDataGridContext must be used within a DataGridContextProvider"
    )
  }

  return context
}

type UseDataGridCellProps<TData, TValue> = {
  field: string
  context: CellContext<TData, TValue>
}

export const useDataGridCell = <TData, TValue>({
  field,
  context,
}: UseDataGridCellProps<TData, TValue>) => {
  const { rowIndex, columnIndex } = context as DataGridCellContext<
    TData,
    TValue
  >

  const coords: CellCoords = useMemo(
    () => ({ row: rowIndex, col: columnIndex }),
    [rowIndex, columnIndex]
  )
  const id = generateCellId(coords)

  const {
    register,
    control,
    anchor,
    onRegisterCell,
    onUnregisterCell,
    getMouseOverHandler,
    getMouseDownHandler,
    getOnChangeHandler,
  } = useDataGridContext()

  useEffect(() => {
    onRegisterCell(coords)

    return () => {
      onUnregisterCell(coords)
    }
  }, [coords, onRegisterCell, onUnregisterCell])

  const container: DataGridCellContainerProps = {
    isAnchor: anchor ? isCellMatch(coords, anchor) : false,
    wrapper: {
      onMouseDown: getMouseDownHandler(coords),
      onMouseOver: getMouseOverHandler(coords),
    },
    overlay: {
      onClick: () => {},
    },
  }

  const attributes = {
    "data-row": coords.row,
    "data-col": coords.col,
    "data-cell-id": id,
    "data-field": field,
  }

  return {
    id,
    register,
    control,
    attributes,
    container,
    onChange: getOnChangeHandler(field),
  }
}
