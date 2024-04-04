import { RouteFocusModal } from "../../../components/route-modal/route-focus-modal"
import { CreateRegionForm } from "./components/create-region-form"
import { useV2Store } from "../../../lib/api-v2"
import { currencies } from "../../../lib/currencies"

export const RegionCreate = () => {
  const { store, isLoading, isError, error } = useV2Store()

  const storeCurrencies = (store?.supported_currency_codes ?? []).map(
    (code) => currencies[code.toUpperCase()]
  )
  const paymentProviders = store?.payment_providers ?? [] // TODO: route not jet implemented

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
