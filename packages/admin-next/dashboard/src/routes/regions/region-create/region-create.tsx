import { useAdminStore } from "medusa-react"
import { RouteFocusModal } from "../../../components/route-modal/route-focus-modal"
import { CreateRegionForm } from "./components/create-region-form"

export const RegionCreate = () => {
  const { store, isLoading, isError, error } = useAdminStore()

  const currencies = store?.currencies ?? []
  const paymentProviders = store?.payment_providers ?? []
  const fulfillmentProviders = store?.fulfillment_providers ?? []

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && (
        <CreateRegionForm
          currencies={currencies}
          fulfillmentProviders={fulfillmentProviders}
          paymentProviders={paymentProviders}
        />
      )}
    </RouteFocusModal>
  )
}
