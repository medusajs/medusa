import { useContext } from "react"
import {
  LayoutEditContextValue,
  LayoutEditContext,
} from "../providers/layout-edit-provider/layout-edit-context"

export const useLayoutEdit = (): LayoutEditContextValue =>
  useContext(LayoutEditContext)
