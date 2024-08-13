import { FocusEvent, MouseEvent, createContext } from "react"
import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { CellCoords, CellType } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  // Grid state
  anchor: CellCoords | null
  trapActive: boolean
  // Cell handlers
  registerCell: (coords: CellCoords, field: string, type: CellType) => void
  getIsCellSelected: (coords: CellCoords) => boolean
  getIsCellDragSelected: (coords: CellCoords) => boolean
  // Grid handlers
  setIsEditing: (value: boolean) => void
  setIsSelecting: (value: boolean) => void
  setRangeEnd: (coords: CellCoords) => void
  setSingleRange: (coords: CellCoords) => void
  // Form state and handlers
  register: UseFormRegister<TForm>
  control: Control<TForm>
  getInputChangeHandler: (field: Path<TForm>) => (next: any, prev: any) => void
  // Wrapper handlers
  getWrapperFocusHandler: (
    coordinates: CellCoords
  ) => (e: FocusEvent<HTMLElement>) => void
  getWrapperMouseOverHandler: (
    coordinates: CellCoords
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
