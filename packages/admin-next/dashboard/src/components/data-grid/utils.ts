import {
  CellContext,
  Column,
  ColumnDefTemplate,
  HeaderContext,
  createColumnHelper,
} from "@tanstack/react-table"
import { FieldError, FieldErrors, FieldValues } from "react-hook-form"
import { CellCoords, ColumnType, FieldFunction } from "./types"

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

export function isFieldError(
  errors: FieldErrors | FieldError
): errors is FieldError {
  return typeof errors === "object" && "message" in errors && "type" in errors
}

export function countFieldErrors(
  errors: FieldErrors | FieldError,
  path?: string
): number {
  // If errors is a FieldError directly, count it as 1
  if (typeof errors === "object" && "message" in errors) {
    if (!path) {
      return 1
    }
    // If path is specified but we're directly on an error, return 1
    if (path === "") {
      return 1
    }
  }

  if (path) {
    const pathSegments = path.split(".")
    let current: any = errors

    for (const segment of pathSegments) {
      if (current && typeof current === "object") {
        current = current[segment]
      } else {
        return 0 // Return 0 if the path doesn't exist in errors
      }
    }

    // If the final object has a message, it is a single error.
    if (current && typeof current === "object" && "message" in current) {
      return 1
    }

    // Otherwise, count errors within the final object
    return countFieldErrors(current)
  }

  // If no path is provided, count all errors in the object
  return Object.values(errors).reduce((acc, error) => {
    if (error && typeof error === "object" && "message" in error) {
      return acc + 1
    } else if (error && typeof error === "object") {
      return acc + countFieldErrors(error)
    }
    return acc
  }, 0)
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

export function convertArrayToPrimitive(
  values: any[],
  type: ColumnType
): any[] {
  switch (type) {
    case "number":
      return values.map(convertToNumber)
    case "boolean":
      return values.map(convertToBoolean)
    case "text":
    default:
      throw new Error(`Unsupported target type "${type}".`)
  }
}

type DataGridHelperColumnsProps<TData, TFieldValues extends FieldValues> = {
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
   * Callback to set the field path for each cell in the column.
   * If a callback is not provided, or returns null, the cell will not be editable.
   */
  field?: FieldFunction<TData, TFieldValues>
  /**
   * Whether the column cannot be hidden by the user.
   *
   * @default false
   */
  disableHiding?: boolean
} & (
  | {
      field: FieldFunction<TData, TFieldValues>
      type: ColumnType
    }
  | { field?: null | undefined; type?: never }
)

export function createDataGridHelper<
  TData,
  TFieldValues extends FieldValues
>() {
  const columnHelper = createColumnHelper<TData>()

  return {
    column: ({
      id,
      name,
      header,
      cell,
      disableHiding = false,
      field,
      type,
    }: DataGridHelperColumnsProps<TData, TFieldValues>) =>
      columnHelper.display({
        id,
        header,
        cell,
        enableHiding: !disableHiding,
        meta: {
          name,
          field,
          type,
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
