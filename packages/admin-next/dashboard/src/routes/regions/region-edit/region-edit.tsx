import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { usePaymentProviders } from "../../../hooks/api/payments"
import { useRegion } from "../../../hooks/api/regions"
import { useStore } from "../../../hooks/api/store"
import { currencies } from "../../../lib/data/currencies"
import { EditRegionForm } from "./components/edit-region-form"
import { usePricePreferences } from "../../../hooks/api/price-preferences"

export const RegionEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const {
    region,
    isPending: isRegionLoading,
    isError: isRegionError,
    error: regionError,
  } = useRegion(id!, { fields: "*payment_providers" })

  const {
    store,
    isPending: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const {
    price_preferences: pricePreferences = [],
    isPending: isPreferenceLoading,
    isError: isPreferenceError,
    error: preferenceError,
  } = usePricePreferences(
    {
      attribute: "region_id",
      value: id,
    },
    { enabled: !!region }
  )

  const isLoading = isRegionLoading || isStoreLoading || isPreferenceLoading

  const storeCurrencies = (store?.supported_currencies ?? []).map(
    (c) => currencies[c.currency_code.toUpperCase()]
  )
  const { payment_providers: paymentProviders = [] } = usePaymentProviders({
    limit: 999,
  })

  if (isRegionError) {
    throw regionError
  }

  if (isStoreError) {
    throw storeError
  }

  if (isPreferenceError) {
    throw preferenceError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("regions.editRegion")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && region && (
        <EditRegionForm
          region={region}
          currencies={storeCurrencies}
          paymentProviders={paymentProviders}
          pricePreferences={pricePreferences}
        />
      )}
    </RouteDrawer>
  )
}
