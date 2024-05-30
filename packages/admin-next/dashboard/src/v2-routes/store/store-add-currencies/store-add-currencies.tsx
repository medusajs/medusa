import { RouteFocusModal } from "../../../components/route-modal"
import { useStore } from "../../../hooks/api/store"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"

export const StoreAddCurrencies = () => {
  const { store, isPending: isLoading, isError, error } = useStore()

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && <AddCurrenciesForm store={store} />}
    </RouteFocusModal>
  )
}
