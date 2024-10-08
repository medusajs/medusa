import { DataGridCoordinates } from "./types"

export function generateCellId(coords: DataGridCoordinates) {
  return `${coords.row}:${coords.col}`
}

/**
 * Check if a cell is equal to a set of coords
 * @param cell - The cell to compare
 * @param coords - The coords to compare
 * @returns Whether the cell is equal to the coords
 */
export function isCellMatch(
  cell: DataGridCoordinates,
  coords?: DataGridCoordinates | null
) {
  if (!coords) {
    return false
  }

  return cell.row === coords.row && cell.col === coords.col
}

const SPECIAL_FOCUS_KEYS = [".", ","]

export function isSpecialFocusKey(event: KeyboardEvent) {
  return SPECIAL_FOCUS_KEYS.includes(event.key) && event.ctrlKey && event.altKey
}