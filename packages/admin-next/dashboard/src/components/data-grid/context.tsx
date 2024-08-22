import { FocusEvent, MouseEvent, createContext } from "react"
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form"
import { CellCoords, CellErrorMetadata, CellMetadata } from "./types"

type DataGridContextType<TFieldValues extends FieldValues> = {
  // Grid state
  anchor: CellCoords | null
  trapActive: boolean
  errors: FieldErrors<TFieldValues>
  // Cell handlers
  getIsCellSelected: (coords: CellCoords) => boolean
  getIsCellDragSelected: (coords: CellCoords) => boolean
  // Grid handlers
  setIsEditing: (value: boolean) => void
  setIsSelecting: (value: boolean) => void
  setRangeEnd: (coords: CellCoords) => void
  setSingleRange: (coords: CellCoords) => void
  // Form state and handlers
  register: UseFormRegister<TFieldValues>
  control: Control<TFieldValues>
  getInputChangeHandler: (
    field: Path<TFieldValues>
  ) => (next: any, prev: any) => void
  // Wrapper handlers
  getWrapperFocusHandler: (
    coordinates: CellCoords
  ) => (e: FocusEvent<HTMLElement>) => void
  getWrapperMouseOverHandler: (
    coordinates: CellCoords
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
  getCellMetadata: (coords: CellCoords) => CellMetadata
  getCellErrorMetadata: (coords: CellCoords) => CellErrorMetadata
  handleGoToField: (field: string) => void
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
