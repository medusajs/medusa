import { RouteFocusModal } from "../../../components/modals"
import { usePricePreferences } from "../../../hooks/api/price-preferences"
import { useStore } from "../../../hooks/api/store"
import { AddCurrenciesForm } from "./components/add-currencies-form/add-currencies-form"

export const StoreAddCurrencies = () => {
  const { store, isPending, isError, error } = useStore()

  const {
    price_preferences: pricePreferences,
    isPending: isPricePreferencesPending,
    isError: isPricePreferencesError,
    error: pricePreferencesError,
  } = usePricePreferences(
    {
      attribute: "currency_code",
      value: store?.supported_currencies?.map((c) => c.currency_code),
    },
    {
      enabled: !!store,
    }
  )

  const ready =
    !!store && !isPending && !!pricePreferences && !isPricePreferencesPending

  if (isError) {
    throw error
  }

  if (isPricePreferencesError) {
    throw pricePreferencesError
  }

  return (
    <RouteFocusModal>
      {ready && (
        <AddCurrenciesForm store={store} pricePreferences={pricePreferences} />
      )}
    </RouteFocusModal>
  )
}
