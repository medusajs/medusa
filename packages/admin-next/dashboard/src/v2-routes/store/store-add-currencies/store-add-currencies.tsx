import { RouteFocusModal } from "../../../components/route-modal"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"
import { useV2Store } from "../../../lib/api-v2"

export const StoreAddCurrencies = () => {
  const { store, isLoading, isError, error } = useV2Store({})

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && <AddCurrenciesForm store={store} />}
    </RouteFocusModal>
  )
}
