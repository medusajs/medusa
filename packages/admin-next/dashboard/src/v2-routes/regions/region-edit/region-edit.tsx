import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditRegionForm } from "./components/edit-region-form"
import { currencies } from "../../../lib/currencies"
import { useRegion } from "../../../hooks/api/regions"
import { usePaymentProviders } from "../../../hooks/api/payments"
import { useStore } from "../../../hooks/api/store"

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

  const isLoading = isRegionLoading || isStoreLoading

  const storeCurrencies = (store?.supported_currency_codes ?? []).map(
    (code) => currencies[code.toUpperCase()]
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
        />
      )}
    </RouteDrawer>
  )
}
