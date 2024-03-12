import { Heading } from "@medusajs/ui"
import { useAdminReturnReason } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditReturnReasonForm } from "./components/edit-return-reason-form"

export const ReturnReasonEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { return_reason, isLoading, isError, error } = useAdminReturnReason(id!)

  const ready = !isLoading && return_reason

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("returnReasons.editReason")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditReturnReasonForm reason={return_reason} />}
    </RouteDrawer>
  )
}
