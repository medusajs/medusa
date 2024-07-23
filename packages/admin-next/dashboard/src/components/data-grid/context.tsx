import { FocusEvent, MouseEvent, createContext } from "react"
import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { CellCoords } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  // Grid state
  anchor: CellCoords | null
  selection: Record<string, boolean>
  dragSelection: Record<string, boolean>
  startEdit: () => void
  // Form state and handlers
  register: UseFormRegister<TForm>
  control: Control<TForm>
  // Input handlers
  getInputMouseDownHandler: (
    coordinates: CellCoords
  ) => (e: MouseEvent<HTMLElement>) => void
  onInputFocus: () => void
  onInputBlur: () => void
  getInputChangeHandler: (field: Path<TForm>) => (next: any, prev: any) => void
  // Overlay handlers
  getOverlayMouseDownHandler: (
    coordinates: CellCoords
  ) => (e: MouseEvent<HTMLElement>) => void
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
