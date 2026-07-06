import { DataGridCoordinates } from "../types"
import { generateCellId } from "../utils"

export class DataGridQueryTool {
  private container: HTMLElement | null

  constructor(container: HTMLElement | null) {
    this.container = container
  }

  getInput(cell: DataGridCoordinates) {
    const id = this._getCellId(cell)

    const input = this.container?.querySelector(`[data-cell-id="${id}"]`)

    if (!input) {
      return null
    }

    return input as HTMLElement
  }

  getInputByField(field: string) {
    const input = this.container?.querySelector(`[data-field="${field}"]`)

    if (!input) {
      return null
    }

    return input as HTMLElement
  }

  getCoordinatesByField(field: string): DataGridCoordinates | null {
    const cell = this.container?.querySelector(
      `[data-field="${field}"][data-cell-id]`
    )

    if (!cell) {
      return null
    }

    const cellId = cell.getAttribute("data-cell-id")

    if (!cellId) {
      return null
    }

    const [row, col] = cellId.split(":").map((n) => parseInt(n, 10))

    if (isNaN(row) || isNaN(col)) {
      return null
    }

    return { row, col }
  }

  getContainer(cell: DataGridCoordinates) {
    const id = this._getCellId(cell)

    const container = this.container?.querySelector(
      `[data-container-id="${id}"]`
    )

    if (!container) {
      return null
    }

    return container as HTMLElement
  }

  private _getCellId(cell: DataGridCoordinates): string {
    return generateCellId(cell)
  }
}