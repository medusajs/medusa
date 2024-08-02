import {
  CellContext,
  Column,
  ColumnDefTemplate,
  HeaderContext,
  createColumnHelper,
} from "@tanstack/react-table"
import { CellCoords, CellType, DataGridColumnType } from "./types"

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

/**
 * Gets the range of cells between two points.
 * @param start - The start point
 * @param end - The end point
 * @returns A map of cell keys for the range
 */
export const getRange = (
  start: CellCoords,
  end: CellCoords
): Record<string, boolean> => {
  const range: Record<string, boolean> = {}

  const minX = Math.min(start.col, end.col)
  const maxX = Math.max(start.col, end.col)

  const minY = Math.min(start.row, end.row)
  const maxY = Math.max(start.row, end.row)

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      range[
        generateCellId({
          row: y,
          col: x,
        })
      ] = true
    }
  }

  return range
}

export function getFieldsInRange(
  range: Record<string, boolean>,
  container: HTMLElement | null
): (string | null)[] {
  container = container || document.body

  if (!container) {
    return []
  }

  const ids = Object.keys(range)

  if (!ids.length) {
    return []
  }

  const fields = ids.map((id) => {
    const cell = container.querySelector(`[data-cell-id="${id}"][data-field]`)

    if (!cell) {
      return null
    }

    return cell.getAttribute("data-field")
  })

  return fields
}

function convertToNumber(value: string | number): number {
  if (typeof value === "number") {
    return value
  }

  const converted = Number(value)

  if (isNaN(converted)) {
    throw new Error(`String "${value}" cannot be converted to number.`)
  }

  return converted
}

function convertToBoolean(value: string | boolean): boolean {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "undefined" || value === null) {
    return false
  }

  const lowerValue = value.toLowerCase()

  if (lowerValue === "true" || lowerValue === "false") {
    return lowerValue === "true"
  }

  throw new Error(`String "${value}" cannot be converted to boolean.`)
}

function convertToString(value: string): string {
  return String(value)
}

export function convertArrayToPrimitive(values: any[], type: CellType): any[] {
  switch (type) {
    case "number":
      return values.map(convertToNumber)
    case "boolean":
      return values.map(convertToBoolean)
    case "text":
    case "select":
      return values.map(convertToString)
    default:
      throw new Error(`Unsupported target type "${type}".`)
  }
}

type DataGridHelperColumnsProps<TData> = {
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
  header: ColumnDefTemplate<HeaderContext<TData, unknown>> | undefined
  /**
   * The cell template for the column.
   */
  cell: ColumnDefTemplate<CellContext<TData, unknown>> | undefined
  /**
   * Whether the column cannot be hidden by the user.
   *
   * @default false
   */
  disableHiding?: boolean
}

export function createDataGridHelper<TData>() {
  const columnHelper = createColumnHelper<TData>()

  return {
    column: ({
      id,
      name,
      header,
      cell,
      disableHiding = false,
    }: DataGridHelperColumnsProps<TData>) =>
      columnHelper.display({
        id,
        header,
        cell,
        enableHiding: !disableHiding,
        meta: {
          name,
        },
      }),
  }
}

export function getColumnName(column: Column<any, any>): string {
  const id = column.columnDef.id
  const meta = column?.columnDef.meta as { name?: string } | undefined

  if (!id) {
    throw new Error(
      "Column is missing an id, which is a required field. Please provide an id for the column."
    )
  }

  if (process.env.NODE_ENV === "development" && !meta?.name) {
    console.warn(
      `Column "${id}" does not have a name. You should add a name to the column definition. Falling back to the column id.`
    )
  }

  return meta?.name || id
}

export function getColumnType(
  cell: CellCoords,
  columns: Column<any, any>[]
): DataGridColumnType {
  const { col } = cell

  const column = columns[col]

  const meta = column?.columnDef.meta as
    | { type?: DataGridColumnType }
    | undefined

  return meta?.type || "string"
}
