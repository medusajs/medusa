import { Heading } from "@medusajs/ui"
import { useAdminOrder, useAdminRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditOrderAddressForm } from "../common/edit-address-form"

export const OrderShippingAddress = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { order, isLoading, isError, error } = useAdminOrder(id!)

  const regionId = order?.region_id

  const {
    region,
    isLoading: isLoadingRegion,
    isError: isErrorRegion,
    error: errorRegion,
  } = useAdminRegion(regionId!, {
    enabled: !!regionId,
  })

  const ready = !isLoading && order && !isLoadingRegion && region
  const countries = region?.countries || []

  if (isError) {
    throw error
  }

  if (isErrorRegion) {
    throw errorRegion
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("addresses.shippingAddress.editHeader")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <EditOrderAddressForm
          order={order}
          countries={countries}
          type="shipping"
        />
      )}
    </RouteDrawer>
  )
}
