import { useContext } from "react"
import { DataGridContext } from "./data-grid-context"

export const useDataGridContext = () => {
  const context = useContext(DataGridContext)

  if (!context) {
    throw new Error(
      "useDataGridContext must be used within a DataGridContextProvider"
    )
  }

  return context
}
