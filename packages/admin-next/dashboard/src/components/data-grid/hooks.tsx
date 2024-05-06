import { useContext, useEffect, useMemo } from "react"
import { DataGridContext } from "./context"
import { CellCoords, DataGridCellContainerProps } from "./types"
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

type UseDataGridCellProps = {
  row: number
  col: number
}

export const useDataGridCell = ({ row, col }: UseDataGridCellProps) => {
  const coords: CellCoords = useMemo(() => ({ row, col }), [row, col])
  const id = generateCellId(coords)

  const { control, anchor, onRegisterCell, onUnregisterCell, onClickOverlay } =
    useDataGridContext()

  useEffect(() => {
    onRegisterCell(coords)

    return () => {
      onUnregisterCell(coords)
    }
  }, [coords, onRegisterCell, onUnregisterCell])

  const container: DataGridCellContainerProps = {
    isAnchor: anchor ? isCellMatch(coords, anchor) : false,
    overlay: {
      onClick: () => onClickOverlay(coords),
    },
  }

  const attributes = {
    "data-row": row,
    "data-col": col,
    "data-cell-id": id,
  }

  return {
    id,
    control,
    attributes,
    container,
  }
}
