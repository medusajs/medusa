import { Store } from "@medusajs/medusa"
import { createContext, useContext } from "react"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import CurrentCurrenciesScreen from "./current-currencies-screen"

type Props = {
  store: Store
  open: boolean
  onClose: () => void
}

type EditCurrenciesModalContextType = {
  onClose: () => void
  store: Store
}

const EditCurrenciesModalContext =
  createContext<EditCurrenciesModalContextType | null>(null)

const EditCurrenciesModal = ({ store, open, onClose }: Props) => {
  const context = useContext(LayeredModalContext)

  return (
    <EditCurrenciesModalContext.Provider value={{ onClose, store }}>
      <LayeredModal context={context} open={open} handleClose={onClose}>
        <CurrentCurrenciesScreen />
      </LayeredModal>
    </EditCurrenciesModalContext.Provider>
  )
}

export const useEditCurrenciesModal = () => {
  const context = useContext(EditCurrenciesModalContext)

  if (!context) {
    throw new Error(
      "useEditCurrenciesModal must be used within EditCurrenciesModal"
    )
  }

  return context
}

export default EditCurrenciesModal
