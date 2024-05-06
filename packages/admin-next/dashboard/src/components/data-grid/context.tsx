import { MouseEvent, createContext } from "react"
import { Control, FieldValues } from "react-hook-form"
import { CellCoords } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  anchor: CellCoords | null
  control: Control<TForm>
  onRegisterCell: (coordinates: CellCoords) => void
  onUnregisterCell: (coordinates: CellCoords) => void
  onClickOverlay: (coordinates: CellCoords) => void
  getMouseDownHandler: (
    coordinates: CellCoords
  ) => (e: MouseEvent<HTMLElement>) => void
  getMouseOverHandler: (
    coordinates: CellCoords
  ) => ((e: MouseEvent<HTMLElement>) => void) | undefined
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
