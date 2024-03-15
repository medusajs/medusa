import { Heading } from "@medusajs/ui"
import { useAdminDraftOrder, useAdminRegion } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditDraftOrderAddressForm } from "../common/edit-address-form"

export const DraftOrderBillingAddress = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { draft_order, isLoading, isError, error } = useAdminDraftOrder(id!)

  const regionId = draft_order?.cart?.region_id

  const {
    region,
    isLoading: isLoadingRegion,
    isError: isErrorRegion,
    error: errorRegion,
  } = useAdminRegion(regionId!, {
    enabled: !!regionId,
  })

  const ready = !isLoading && draft_order && !isLoadingRegion && region
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
        <Heading>{t("addresses.billingAddress.editHeader")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <EditDraftOrderAddressForm
          draftOrder={draft_order}
          countries={countries}
          type="billing"
        />
      )}
    </RouteDrawer>
  )
}
