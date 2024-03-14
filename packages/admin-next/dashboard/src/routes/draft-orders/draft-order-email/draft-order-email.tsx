import { Heading } from "@medusajs/ui"
import { useAdminDraftOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditDraftOrderEmailForm } from "./components/edit-draft-order-email-form/edit-draft-order-email-form"

export const DraftOrderEmail = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { draft_order, isLoading, isError, error } = useAdminDraftOrder(id!)

  const ready = !isLoading && draft_order

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("email.editHeader")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditDraftOrderEmailForm draftOrder={draft_order} />}
    </RouteDrawer>
  )
}
