import { RouteFocusModal } from "../../../components/route-modal"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"
import { useStore } from "../../../hooks/api/store"

export const StoreAddCurrencies = () => {
  const { store, isLoading, isError, error } = useStore({})

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && <AddCurrenciesForm store={store} />}
    </RouteFocusModal>
  )
}
