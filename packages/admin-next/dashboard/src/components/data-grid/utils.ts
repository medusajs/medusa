import {
  CellContext,
  Column,
  ColumnDefTemplate,
  HeaderContext,
  createColumnHelper,
} from "@tanstack/react-table"
import { CellCoords, DataGridColumnType } from "./types"

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

export function convertArrayToPrimitive<
  T extends "boolean" | "number" | "string"
>(values: string[], type: T) {
  const convertedValues: any[] = []

  for (const value of values) {
    if (type === "number") {
      const converted = Number(value)
      if (isNaN(converted)) {
        throw new Error(`String "${value}" cannot be converted to number.`)
      }
      convertedValues.push(converted)
    } else if (type === "boolean") {
      const lowerValue = value.toLowerCase()
      if (lowerValue === "true" || lowerValue === "false") {
        convertedValues.push(lowerValue === "true")
      } else {
        throw new Error(`String "${value}" cannot be converted to boolean.`)
      }
    } else if (type === "string") {
      convertedValues.push(String(value))
    } else {
      throw new Error(`Unsupported target type "${type}".`)
    }
  }

  return convertedValues
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
   * The type of the column. This is used to for parsing the value of cells
   * in the column in commands like copy and paste.
   */
  type?: DataGridColumnType
  /**
   * Whether to only validate that the value can be converted to the desired
   * type, but pass through the raw value to the form.
   *
   * An example of this might be a column with a type of "number" but the
   * field is a string. This allows the commands to validate that the value
   * can be converted to the desired type, but still pass through the raw
   * value to the form.
   *
   * @example
   * ```tsx
   * columnHelper.column({
   *  id: "price",
   *  // ...
   *  type: "number",
   *  asString: true,
   * })
   * ```
   */
  asString?: boolean
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
      type = "string",
      asString,
      disableHiding = false,
    }: DataGridHelperColumnsProps<TData>) =>
      columnHelper.display({
        id,
        header,
        cell,
        enableHiding: !disableHiding,
        meta: {
          type,
          asString,
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
  cellId: string,
  columns: Column<any, any>[]
): DataGridColumnType {
  const { col } = parseCellId(cellId)

  const column = columns[col]

  const meta = column?.columnDef.meta as
    | { type?: DataGridColumnType }
    | undefined

  return meta?.type || "string"
}
