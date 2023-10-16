import {
  BorderAttributes,
  BoundingBox,
  CellWithParentRow,
  DragPosition,
  Point,
} from "./types"

const EDITABLE_ATTRIBUTE = "data-editable"

export const getKey = (point: Point) => {
  return `${point.row}-${point.col}`
}

export const getPoint = (key: string): Point => {
  const [row, col] = key.split("-")
  return { row: parseInt(row), col: parseInt(col) }
}

export const getPointFromElement = (
  element: HTMLElement | null
): Point | null => {
  if (!element) {
    return null
  }

  const target = element.closest("td") as HTMLElement | null

  if (!target || !isParentRow(target)) {
    return null
  }

  const col = target.cellIndex
  const row = target.parentElement.rowIndex

  if (!row || !col) {
    return null
  }

  return { row, col }
}

export const getElementFromPoint = (
  point: Point | null,
  root?: HTMLElement | null
): HTMLElement | null => {
  const parent = root || document

  if (!point) {
    return null
  }

  const cell = parent.querySelector(
    `td[data-row-index="${point.row}"][data-col-index="${point.col}"]`
  ) as HTMLElement | null

  return cell
}

/**
 * Checks if the parent of an element is a table row.
 * @param element - The element to check
 * @returns `true` if the parent of the element is a table row, `false` otherwise
 */
export const isParentRow = (
  element: HTMLElement | null
): element is CellWithParentRow => {
  if (!element) {
    return false
  }

  const parent = element.parentElement

  return !!parent && parent.nodeName === "TR"
}

/**
 * Validates that the target of an interaction is a valid cell.
 * @param target - The target element to validate
 * @returns - The validated target element or `null` if the target is invalid
 */
export const validateTarget = (
  target: HTMLElement | null
): CellWithParentRow | null => {
  if (!target) {
    return null
  }

  const cell = target.closest("td")

  if (!cell) {
    return null
  }

  const isEditable = cell.getAttribute(EDITABLE_ATTRIBUTE) === "true"

  if (!isEditable) {
    return null
  }

  const isNestedInRow = isParentRow(cell)

  if (!isNestedInRow) {
    return null
  }

  return cell
}

function generateRangeArray(start: number, end: number): number[] {
  if (start > end) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;[end, start] = [start, end]
  }

  const result: number[] = []

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  return result
}

export const getDragToFillSelection = (
  target: HTMLElement | null,
  selection: Record<string, boolean>
): { range: Record<string, boolean>; position: DragPosition } | null => {
  if (!target) {
    return null
  }

  const isValidTarget = validateTarget(target)

  if (!isValidTarget) {
    return null
  }

  const position = getPointFromElement(target)

  if (!position) {
    return null
  }

  const selectionPoints = Object.keys(selection).map((key) => getPoint(key))

  const { topLeft, bottomRight } = calculateBoundingBoxes(selectionPoints)[0]

  if (!topLeft || !bottomRight) {
    return null
  }

  // Find out if the position is left, right, above or below the selection
  const isLeft = position.col < topLeft.col
  const isRight = position.col > bottomRight.col
  const isAbove = position.row < topLeft.row
  const isBelow = position.row > bottomRight.row

  // If the position is not left, right, above or below the selection, we return null, as the position is not valid
  if (!isLeft && !isRight && !isAbove && !isBelow) {
    return null
  }

  const acceptedRows = generateRangeArray(topLeft.row, bottomRight.row)
  const acceptedCols = generateRangeArray(topLeft.col, bottomRight.col)

  let isValidPosition = false

  // If the position is left or right of the selection, we check if the position is in the accepted row range
  if (isLeft || isRight) {
    const isInAcceptedRowRange = acceptedRows.includes(position.row)

    if (!isInAcceptedRowRange) {
      isValidPosition = false
    }

    isValidPosition = true
  }

  // If the position is above or below the selection, we check if the position is in the accepted column range
  if (isAbove || isBelow) {
    const isInAcceptedColRange = acceptedCols.includes(position.col)

    if (!isInAcceptedColRange) {
      isValidPosition = false
    }

    isValidPosition = true
  }

  if (!isValidPosition) {
    // If the position is not valid, we attempt to find the nearest valid position that is within the accepted row or column range
    if (isAbove && isRight) {
      // Find out if we are closest to a valid row or column
      const rowDifference = topLeft.row - position.row
      const colDifference = position.col - bottomRight.col

      if (rowDifference < colDifference) {
        const start = { row: topLeft.row - 1, col: bottomRight.col }
        const end = { row: position.row, col: topLeft.col }

        return { range: getRange(start, end), position: "above" }
      }

      const start = { row: topLeft.row, col: bottomRight.col + 1 }
      const end = { row: bottomRight.row, col: position.col }

      return { range: getRange(start, end), position: "right" }
    }

    if (isAbove && isLeft) {
      const rowDifference = topLeft.row - position.row
      const colDifference = topLeft.col - position.col

      if (rowDifference < colDifference) {
        const start = { row: topLeft.row - 1, col: topLeft.col }
        const end = { row: position.row, col: bottomRight.col }

        return { range: getRange(start, end), position: "above" }
      }

      const start = { row: topLeft.row, col: position.col }
      const end = { row: bottomRight.row, col: topLeft.col - 1 }

      return { range: getRange(start, end), position: "left" }
    }

    if (isBelow && isRight) {
      const rowDifference = position.row - bottomRight.row
      const colDifference = position.col - bottomRight.col

      if (rowDifference < colDifference) {
        const start = { row: bottomRight.row, col: bottomRight.col + 1 }
        const end = { row: position.row, col: topLeft.col }

        return { range: getRange(start, end), position: "below" }
      }

      const start = { row: bottomRight.row + 1, col: topLeft.col }
      const end = { row: position.row, col: bottomRight.col }

      return { range: getRange(start, end), position: "right" }
    }

    if (isBelow && isLeft) {
      const rowDifference = position.row - bottomRight.row
      const colDifference = topLeft.col - position.col

      if (rowDifference < colDifference) {
        const start = { row: bottomRight.row, col: topLeft.col - 1 }
        const end = { row: position.row, col: bottomRight.col }

        return { range: getRange(start, end), position: "below" }
      }

      const start = { row: bottomRight.row + 1, col: bottomRight.col }
      const end = { row: position.row, col: topLeft.col }

      return { range: getRange(start, end), position: "left" }
    }

    return null
  }

  if (isLeft) {
    const start = { row: topLeft.row, col: position.col }
    const end = { row: bottomRight.row, col: topLeft.col - 1 }

    return { range: getRange(start, end), position: "left" }
  }

  if (isRight) {
    const start = { row: topLeft.row, col: bottomRight.col + 1 }
    const end = { row: bottomRight.row, col: position.col }

    return { range: getRange(start, end), position: "right" }
  }

  if (isAbove) {
    const start = { row: topLeft.row - 1, col: topLeft.col }
    const end = { row: position.row, col: bottomRight.col }

    return { range: getRange(start, end), position: "above" }
  }

  if (isBelow) {
    const start = { row: bottomRight.row + 1, col: topLeft.col }
    const end = { row: position.row, col: bottomRight.col }

    return { range: getRange(start, end), position: "below" }
  }

  return null
}

/**
 * Gets the range of cells between two points.
 * @param start - The start point
 * @param end - The end point
 * @returns A map of cell keys for the range
 */
export const getRange = (start: Point, end: Point): Record<string, boolean> => {
  const range: Record<string, boolean> = {}

  const minX = Math.min(start.col, end.col)
  const maxX = Math.max(start.col, end.col)

  const minY = Math.min(start.row, end.row)
  const maxY = Math.max(start.row, end.row)

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      range[`${y}-${x}`] = true
    }
  }

  return range
}

/**
 * Gets the cell attributes for a given range.
 * @param start - The start point
 * @param end - The end point
 * @param root - The root element to search for cells, defaults to `document`
 * @returns A list of cell attributes for the range
 */
export const getCellAttributes = (
  start: Point,
  end: Point,
  root?: HTMLElement | null
) => {
  const parent = root || document

  const range = getRange(start, end)

  const attributes = Object.keys(range).map((key) => {
    const point = getPoint(key)

    const cell = parent.querySelector(
      `td[data-row-index="${point.row}"][data-col-index="${point.col}"]`
    )

    if (!cell) {
      return null
    }

    const variantId = cell.getAttribute("data-variant-id")
    const regionId = cell.getAttribute("data-region-id")
    const currencyCode = cell.getAttribute("data-currency-code")
    const type = cell.getAttribute("data-type") as
      | "min_quantity"
      | "max_quantity"
      | "amount"

    if (!variantId || (!regionId && !currencyCode) || !type) {
      return null
    }

    return {
      variantId,
      regionId,
      currencyCode,
      type,
    }
  })

  return attributes.filter(Boolean) as {
    variantId: string
    regionId: string | null
    currencyCode: string | null
    type: "min_quantity" | "max_quantity" | "amount"
  }[]
}

/**
 * Calculates the bounding boxes for a list of points.
 * @param points - The points to calculate bounding boxes for
 * @returns Returns a list of bounding boxes for the given points
 */
export const calculateBoundingBoxes = (points: Point[]): BoundingBox[] => {
  const grid = new Map<number, Set<number>>()
  for (const { col, row } of points) {
    if (!grid.has(col)) {
      grid.set(col, new Set<number>())
    }

    grid.get(col)!.add(row)
  }

  const visited = new Set<string>()
  const components: Point[][] = []

  const dfs = (col: number, row: number, component: Point[]) => {
    if (
      !grid.has(col) ||
      !grid.get(col)!.has(row) ||
      visited.has(`${col}-${row}`)
    ) {
      return
    }

    visited.add(`${col}-${row}`)
    component.push({ col, row })

    const neighbours: Point[] = [
      { col: col - 1, row },
      { col: col + 1, row },
      { col, row: row - 1 },
      { col, row: row + 1 },
    ]

    for (const { col, row } of neighbours) {
      dfs(col, row, component)
    }
  }

  for (const { col, row } of points) {
    if (!visited.has(`${col}-${row}`)) {
      const component: Point[] = []
      dfs(col, row, component)
      components.push(component)
    }
  }

  const boundingBoxes: BoundingBox[] = components.map((component) => {
    const minX = Math.min(...component.map((point) => point.col))
    const maxX = Math.max(...component.map((point) => point.col))

    const minY = Math.min(...component.map((point) => point.row))
    const maxY = Math.max(...component.map((point) => point.row))

    const topLeft: Point = {
      col: minX,
      row: minY,
    }

    const bottomRight: Point = {
      col: maxX,
      row: maxY,
    }

    return {
      topLeft,
      bottomRight,
    }
  })

  return boundingBoxes
}

/**
 * Checks if a point is inside a bounding box.
 * @param point - The point to check
 * @param boundingBox - The bounding box to check
 * @returns Whether the point is inside the bounding box
 */
const isPointInsideBoundingBox = (
  point: Point,
  boundingBox: BoundingBox
): boolean => {
  const { topLeft, bottomRight } = boundingBox
  if (!topLeft || !bottomRight) {
    return false
  }
  return (
    point.col >= topLeft.col &&
    point.col <= bottomRight.col &&
    point.row >= topLeft.row &&
    point.row <= bottomRight.row
  )
}

/**
 * Gets the border attributes for a point.
 * @param point - The point to get the border attributes for
 * @param boundingBoxes - The bounding boxes to check
 * @returns A map of border attributes for the point
 */
export const getBorderAttributes = (
  point: Point | null,
  boundingBoxes: BoundingBox[]
): BorderAttributes => {
  const borders = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  }

  if (!point) {
    return borders
  }

  for (const boundingBox of boundingBoxes) {
    if (isPointInsideBoundingBox(point, boundingBox)) {
      if (point.row === boundingBox.topLeft?.row) {
        borders.top = true
      }
      if (point.col === boundingBox.topLeft?.col) {
        borders.left = true
      }
      if (point.row === boundingBox.bottomRight?.row) {
        borders.bottom = true
      }
      if (point.col === boundingBox.bottomRight?.col) {
        borders.right = true
      }
    }
  }

  return borders
}

export const getRect = (
  selection: Record<string, boolean>,
  parent: HTMLElement | null
) => {
  if (!parent) {
    return null
  }

  const keys = Object.keys(selection)

  if (!keys.length) {
    return null
  }

  const points = keys.map((key) => getPoint(key))

  // Get elements from the points and filter out nulls
  const elements = points
    .map((point) => getElementFromPoint(point))
    .filter(Boolean)

  if (!elements.length) {
    return null
  }

  // Get the width and height of the selection as well as offset from the parents top left corner
  const firstElement = elements[0]
  const lastElement = elements[elements.length - 1]

  if (!firstElement || !lastElement) {
    return null
  }

  const firstRect = firstElement.getBoundingClientRect()
  const lastRect = lastElement.getBoundingClientRect()

  const width = lastRect.right - firstRect.left

  const height = lastRect.bottom - firstRect.top

  const parentRect = parent.getBoundingClientRect()

  const left = firstRect.left - parentRect.left

  const top = firstRect.top - parentRect.top

  return {
    width,
    height,
    left,
    top,
  }
}
