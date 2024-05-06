import { CellCoords } from "./types"

export function generateCellId(coords: CellCoords) {
  return `${coords.row}:${coords.col}`
}

export function parseCellId(cellId: string): CellCoords {
  const [row, col] = cellId.split(":").map(Number)

  if (isNaN(row) || isNaN(col)) {
    throw new Error(`Invalid cell id: ${cellId}`)
  }

  return { row, col }
}

/**
 * Check if a cell is equal to a set of coords
 * @param cell - The cell to compare
 * @param coords - The coords to compare
 * @returns Whether the cell is equal to the coords
 */
export function isCellMatch(cell: CellCoords, coords?: CellCoords | null) {
  if (!coords) {
    return false
  }

  return cell.row === coords.row && cell.col === coords.col
}
