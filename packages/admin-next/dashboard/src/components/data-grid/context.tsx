import { createContext } from "react"
import { Control, FieldValues } from "react-hook-form"
import { CellCoords } from "./types"

type DataGridContextType<TForm extends FieldValues> = {
  anchor: CellCoords | null
  control: Control<TForm>
  onRegisterCell: (coordinates: CellCoords) => void
  onUnregisterCell: (coordinates: CellCoords) => void
  onClickOverlay: (coordinates: CellCoords) => void
}

export const DataGridContext = createContext<DataGridContextType<any> | null>(
  null
)
