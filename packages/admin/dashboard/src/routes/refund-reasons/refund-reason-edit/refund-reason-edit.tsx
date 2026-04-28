import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useRefundReason } from "../../../hooks/api/refund-reasons"
import { RefundReasonEditForm } from "./components/refund-reason-edit-form"

export const RefundReasonEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { refund_reason, isPending, isError, error } = useRefundReason(id!)

  const ready = !isPending && !!refund_reason

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("refundReasons.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("refundReasons.edit.subtitle")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <RefundReasonEditForm refundReason={refund_reason} />}
    </RouteDrawer>
  )
}
