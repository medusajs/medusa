import { Command } from "../../hooks/use-command-history"
import { CellCoords, CellType } from "./types"
import { generateCellId } from "./utils"

export class Matrix {
  private cells: ({ field: string; type: CellType } | null)[][]

  constructor(rows: number, cols: number) {
    this.cells = Array.from({ length: rows }, () => Array(cols).fill(null))
  }

  getFirstNavigableCell(): CellCoords | null {
    for (let row = 0; row < this.cells.length; row++) {
      for (let col = 0; col < this.cells[0].length; col++) {
        if (this.cells[row][col] !== null) {
          return { row, col }
        }
      }
    }

    return null
  }

  // Register a navigable cell with a unique key
  registerField(row: number, col: number, field: string, type: CellType) {
    if (this._isValidPosition(row, col)) {
      this.cells[row][col] = {
        field,
        type,
      }
    }
  }

  getFieldsInSelection(
    start: CellCoords | null,
    end: CellCoords | null
  ): string[] {
    const keys: string[] = []

    if (!start || !end) {
      return keys
    }

    if (start.col !== end.col) {
      throw new Error("Selection must be in the same column")
    }

    const startRow = Math.min(start.row, end.row)
    const endRow = Math.max(start.row, end.row)
    const col = start.col

    for (let row = startRow; row <= endRow; row++) {
      if (this._isValidPosition(row, col) && this.cells[row][col] !== null) {
        keys.push(this.cells[row][col]?.field as string)
      }
    }

    return keys
  }

  getCellField(cell: CellCoords): string | null {
    if (this._isValidPosition(cell.row, cell.col)) {
      return this.cells[cell.row][cell.col]?.field || null
    }

    return null
  }

  getCellType(cell: CellCoords): CellType | null {
    if (this._isValidPosition(cell.row, cell.col)) {
      return this.cells[cell.row][cell.col]?.type || null
    }

    return null
  }

  getIsCellSelected(
    cell: CellCoords | null,
    start: CellCoords | null,
    end: CellCoords | null
  ): boolean {
    if (!cell || !start || !end) {
      return false
    }

    if (start.col !== end.col) {
      throw new Error("Selection must be in the same column")
    }

    const startRow = Math.min(start.row, end.row)
    const endRow = Math.max(start.row, end.row)
    const col = start.col

    return cell.col === col && cell.row >= startRow && cell.row <= endRow
  }

  getValidMovement(
    row: number,
    col: number,
    direction: string,
    metaKey: boolean = false
  ): CellCoords {
    const [dRow, dCol] = this._getDirectionDeltas(direction)

    if (metaKey) {
      return this._getLastValidCellInDirection(row, col, dRow, dCol)
    } else {
      let newRow = row + dRow
      let newCol = col + dCol

      if (
        newRow < 0 ||
        newRow >= this.cells.length ||
        newCol < 0 ||
        newCol >= this.cells[0].length
      ) {
        return { row, col }
      }

      while (
        this._isValidPosition(newRow, newCol) &&
        this.cells[newRow][newCol] === null
      ) {
        newRow += dRow
        newCol += dCol

        if (
          newRow < 0 ||
          newRow >= this.cells.length ||
          newCol < 0 ||
          newCol >= this.cells[0].length
        ) {
          return { row, col }
        }
      }

      return this._isValidPosition(newRow, newCol)
        ? { row: newRow, col: newCol }
        : { row, col }
    }
  }

  private _isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.cells.length &&
      col >= 0 &&
      col < this.cells[0].length
    )
  }

  private _getDirectionDeltas(direction: string): [number, number] {
    switch (direction) {
      case "ArrowUp":
        return [-1, 0]
      case "ArrowDown":
        return [1, 0]
      case "ArrowLeft":
        return [0, -1]
      case "ArrowRight":
        return [0, 1]
      default:
        return [0, 0]
    }
  }

  private _getLastValidCellInDirection(
    row: number,
    col: number,
    dRow: number,
    dCol: number
  ): CellCoords {
    let newRow = row
    let newCol = col
    let lastValidRow = row
    let lastValidCol = col

    while (this._isValidPosition(newRow + dRow, newCol + dCol)) {
      newRow += dRow
      newCol += dCol
      if (this.cells[newRow][newCol] !== null) {
        lastValidRow = newRow
        lastValidCol = newCol
      }
    }

    return {
      row: lastValidRow,
      col: lastValidCol,
    }
  }
}

export class GridQueryTool {
  private container: HTMLElement | null

  constructor(container: HTMLElement | null) {
    this.container = container
  }

  getInput(cell: CellCoords) {
    const id = this._getCellId(cell)

    const input = this.container?.querySelector(`[data-cell-id="${id}"]`)

    if (!input) {
      return null
    }

    return input as HTMLElement
  }

  getContainer(cell: CellCoords) {
    const id = this._getCellId(cell)

    const container = this.container?.querySelector(
      `[data-container-id="${id}"]`
    )

    if (!container) {
      return null
    }

    return container as HTMLElement
  }

  private _getCellId(cell: CellCoords): string {
    return generateCellId(cell)
  }
}

export type BulkUpdateCommandArgs = {
  fields: string[]
  next: any[]
  prev: any[]
  setter: (fields: string[], values: any[]) => void
}

export class BulkUpdateCommand implements Command {
  private _fields: string[]

  private _prev: any[]
  private _next: any[]

  private _setter: (fields: string[], any: string[]) => void

  constructor({ fields, prev, next, setter }: BulkUpdateCommandArgs) {
    this._fields = fields
    this._prev = prev
    this._next = next
    this._setter = setter
  }

  execute(): void {
    this._setter(this._fields, this._next)
  }
  undo(): void {
    this._setter(this._fields, this._prev)
  }
  redo(): void {
    this.execute()
  }
}

export type UpdateCommandArgs = {
  prev: any
  next: any
  setter: (value: any) => void
}

export class UpdateCommand implements Command {
  private _prev: any
  private _next: any

  private _setter: (value: any) => void

  constructor({ prev, next, setter }: UpdateCommandArgs) {
    this._prev = prev
    this._next = next

    this._setter = setter
  }

  execute(): void {
    this._setter(this._next)
  }

  undo(): void {
    this._setter(this._prev)
  }

  redo(): void {
    this.execute()
  }
}
