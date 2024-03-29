import { useAdminStore } from "medusa-react"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"

export const StoreAddCurrencies = () => {
  const { store, isLoading, isError, error } = useAdminStore()

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && <AddCurrenciesForm store={store} />}
    </RouteFocusModal>
  )
}
