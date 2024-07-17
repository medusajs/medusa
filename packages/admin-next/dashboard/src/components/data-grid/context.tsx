import { MouseEvent, createContext } from "react"
import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { CellCoords } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  anchor: CellCoords | null
  register: UseFormRegister<TForm>
  control: Control<TForm>
  onRegisterCell: (coordinates: CellCoords) => void
  onUnregisterCell: (coordinates: CellCoords) => void
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
  getWrapperMouseOverHandler: (
    coordinates: CellCoords
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
