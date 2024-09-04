import { FocusEvent, MouseEvent, createContext } from "react"
import {
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form"
import { CellErrorMetadata, CellMetadata, DataGridCoordinates } from "../types"

type DataGridContextType<TFieldValues extends FieldValues> = {
  // Grid state
  anchor: DataGridCoordinates | null
  trapActive: boolean
  setTrapActive: (value: boolean) => void
  errors: FieldErrors<TFieldValues>
  // Cell handlers
  getIsCellSelected: (coords: DataGridCoordinates) => boolean
  getIsCellDragSelected: (coords: DataGridCoordinates) => boolean
  // Grid handlers
  setIsEditing: (value: boolean) => void
  setIsSelecting: (value: boolean) => void
  setRangeEnd: (coords: DataGridCoordinates) => void
  setSingleRange: (coords: DataGridCoordinates) => void
  // Form state and handlers
  register: UseFormRegister<TFieldValues>
  control: Control<TFieldValues>
  getInputChangeHandler: (
    field: Path<TFieldValues>
  ) => (next: any, prev: any) => void
  // Wrapper handlers
  getWrapperFocusHandler: (
    coordinates: DataGridCoordinates
  ) => (e: FocusEvent<HTMLElement>) => void
  getWrapperMouseOverHandler: (
    coordinates: DataGridCoordinates
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
  getCellMetadata: (coords: DataGridCoordinates) => CellMetadata
  getCellErrorMetadata: (coords: DataGridCoordinates) => CellErrorMetadata
  navigateToField: (field: string) => void
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
