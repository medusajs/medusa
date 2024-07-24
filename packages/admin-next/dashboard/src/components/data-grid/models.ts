import { Command } from "../../hooks/use-command-history"
import { CellCoords } from "./types"

export class Matrix {
  private cells: boolean[][]

  constructor(rows: number, cols: number) {
    this.cells = Array.from({ length: rows }, () => Array(cols).fill(false))
  }

  getFirstNavigableCell(): CellCoords | null {
    for (let row = 0; row < this.cells.length; row++) {
      for (let col = 0; col < this.cells[0].length; col++) {
        if (this.cells[row][col]) {
          return { row, col }
        }
      }
    }

    return null
  }

  // Register a cell when it is rendered and is not readonly
  registerCell(row: number, col: number, isNavigable: boolean) {
    if (this._isValidPosition(row, col)) {
      this.cells[row][col] = isNavigable
    }
  }

  getValidMovement(
    row: number,
    col: number,
    direction: string,
    metaKey: boolean = false
  ): CellCoords {
    const [dRow, dCol] = this._getDirectionDeltas(direction)

    if (metaKey) {
      // Move to the last valid cell in the given direction
      return this._getLastValidCellInDirection(row, col, dRow, dCol)
    } else {
      // Move to the next valid cell in the given direction
      let newRow = row + dRow
      let newCol = col + dCol

      // Handle edge wrapping
      if (newCol < 0) {
        // Wrap to previous row, last column
        newRow -= 1
        newCol = this.cells[0].length - 1
      } else if (newCol >= this.cells[0].length) {
        // Wrap to next row, first column
        newRow += 1
        newCol = 0
      } else if (newRow < 0) {
        // Wrap to previous column, last row
        newCol -= 1
        newRow = this.cells.length - 1
      } else if (newRow >= this.cells.length) {
        // Wrap to next column, first row
        newCol += 1
        newRow = 0
      }

      // Validate new position and find next navigable cell
      while (
        this._isValidPosition(newRow, newCol) &&
        !this.cells[newRow][newCol]
      ) {
        newRow += dRow
        newCol += dCol
        // Adjust for edge wrapping again
        if (newCol < 0) {
          newRow -= 1
          newCol = this.cells[0].length - 1
        } else if (newCol >= this.cells[0].length) {
          newRow += 1
          newCol = 0
        } else if (newRow < 0) {
          newCol -= 1
          newRow = this.cells.length - 1
        } else if (newRow >= this.cells.length) {
          newCol += 1
          newRow = 0
        }
      }

      return this._isValidPosition(newRow, newCol)
        ? { row: newRow, col: newCol }
        : { row, col }
    }
  }

  // Check if a position is valid within the grid
  private _isValidPosition(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.cells.length &&
      col >= 0 &&
      col < this.cells[0].length
    )
  }

  // Get direction deltas based on the arrow key direction
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

  // Get the last valid cell in a given direction
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
      if (this.cells[newRow][newCol]) {
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

export type PasteCommandArgs = {
  selection: Record<string, boolean>
  next: string[]
  prev: string[]
  setter: (selection: Record<string, boolean>, values: string[]) => void
}

export class PasteCommand implements Command {
  private _selection: Record<string, boolean>

  private _prev: string[]
  private _next: string[]

  private _setter: (
    selection: Record<string, boolean>,
    values: string[]
  ) => void

  constructor({ selection, prev, next, setter }: PasteCommandArgs) {
    this._selection = selection
    this._prev = prev
    this._next = next
    this._setter = setter
  }

  execute(): void {
    this._setter(this._selection, this._next)
  }
  undo(): void {
    this._setter(this._selection, this._prev)
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
