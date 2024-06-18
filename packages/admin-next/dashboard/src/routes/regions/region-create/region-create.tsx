import { RouteFocusModal } from "../../../components/route-modal/route-focus-modal"
import { usePaymentProviders } from "../../../hooks/api/payments"
import { useStore } from "../../../hooks/api/store"
import { currencies } from "../../../lib/data/currencies"
import { CreateRegionForm } from "./components/create-region-form"

export const RegionCreate = () => {
  const { store, isPending: isLoading, isError, error } = useStore()

  const storeCurrencies = (store?.supported_currency_codes ?? []).map(
    (code) => currencies[code.toUpperCase()]
  )
  const { payment_providers: paymentProviders = [] } = usePaymentProviders()

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && store && (
        <CreateRegionForm
          currencies={storeCurrencies}
          paymentProviders={paymentProviders}
        />
      )}
    </RouteFocusModal>
  )
}
