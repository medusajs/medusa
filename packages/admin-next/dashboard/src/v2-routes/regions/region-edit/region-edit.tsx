import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditRegionForm } from "./components/edit-region-form"
import { useV2Region } from "../../../lib/api-v2/region"
import { useV2Store } from "../../../lib/api-v2"
import { currencies } from "../../../lib/currencies"
import { useV2PaymentProviders } from "../../../lib/api-v2/payment"

export const RegionEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const {
    region,
    isLoading: isRegionLoading,
    isError: isRegionError,
    error: regionError,
  } = useV2Region(id!, { fields: "*payment_providers" })

  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useV2Store()

  const isLoading = isRegionLoading || isStoreLoading

  const storeCurrencies = (store?.supported_currency_codes ?? []).map(
    (code) => currencies[code.toUpperCase()]
  )
  const { payment_providers: paymentProviders = [] } = useV2PaymentProviders({
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
