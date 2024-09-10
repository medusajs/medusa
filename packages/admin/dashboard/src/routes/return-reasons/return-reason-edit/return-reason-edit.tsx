import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useReturnReason } from "../../../hooks/api/return-reasons"
import { ReturnReasonEditForm } from "./components/return-reason-edit-form"

export const ReturnReasonEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { return_reason, isPending, isError, error } = useReturnReason(id!)

  const ready = !isPending && !!return_reason

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("returnReasons.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("returnReasons.edit.subtitle")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <ReturnReasonEditForm returnReason={return_reason} />}
    </RouteDrawer>
  )
}
