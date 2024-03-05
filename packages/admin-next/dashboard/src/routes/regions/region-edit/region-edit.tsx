import { Heading } from "@medusajs/ui"
import { useAdminRegion, useAdminStore } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditRegionForm } from "./components/edit-region-form"

export const RegionEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const {
    region,
    isLoading: isRegionLoading,
    isError: isRegionError,
    error: regionError,
  } = useAdminRegion(id!)

  const {
    store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    error: storeError,
  } = useAdminStore()

  const isLoading = isRegionLoading || isStoreLoading

  const currencies = store?.currencies || []
  const paymentProviders = store?.payment_providers || []
  const fulfillmentProviders = store?.fulfillment_providers || []

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
          currencies={currencies}
          paymentProviders={paymentProviders}
          fulfillmentProviders={fulfillmentProviders}
        />
      )}
    </RouteDrawer>
  )
}
