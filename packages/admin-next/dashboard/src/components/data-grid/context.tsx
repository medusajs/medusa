import { MouseEvent, createContext } from "react"
import { Control, FieldValues, Path, UseFormRegister } from "react-hook-form"
import { CellCoords } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  anchor: CellCoords | null
  register: UseFormRegister<TForm>
  control: Control<TForm>
  onRegisterCell: (coordinates: CellCoords) => void
  onUnregisterCell: (coordinates: CellCoords) => void
  getMouseDownHandler: (
    coordinates: CellCoords
  ) => (e: MouseEvent<HTMLElement>) => void
  getMouseOverHandler: (
    coordinates: CellCoords
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
  getOnChangeHandler: (field: Path<TForm>) => (next: any, prev: any) => void
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
