export enum GridCellType {
  VOID = "void",
  READONLY = "readonly",
  EDITABLE = "editable",
  OVERLAY = "overlay",
}

export const NON_INTERACTIVE_CELL_TYPES = [
  GridCellType.VOID,
  GridCellType.READONLY,
]
