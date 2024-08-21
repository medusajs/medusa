import { Button, Container, Heading, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useOrderPreview } from "../../../../../hooks/api"
import { ExclamationCircleSolid } from "@medusajs/icons"
import {
  useCancelOrderEdit,
  useConfirmOrderEdit,
} from "../../../../../hooks/api/order-edits"

type OrderActiveEditSectionProps = {
  orderId: string
}

export const OrderActiveEditSection = ({
  orderId,
}: OrderActiveEditSectionProps) => {
  const { t } = useTranslation()

  const { order: orderPreview } = useOrderPreview(orderId)

  const { mutateAsync: cancelOrderEdit } = useCancelOrderEdit(orderId)
  const { mutateAsync: confirmOrderEdit } = useConfirmOrderEdit(orderId)

  const onConfirmOrderEdit = async () => {
    try {
      await confirmOrderEdit()

      toast.success(t("orders.edits.toast.confirmedSuccessfully"))
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onCancelOrderEdit = async () => {
    try {
      await cancelOrderEdit()

      toast.success(t("orders.edits.toast.canceledSuccessfully"))
    } catch (e) {
      toast.error(e.message)
    }
  }

  if (!orderPreview || orderPreview.order_change.change_type !== "edit") {
    return null
  }

  return (
    <div
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
      }}
      className="-m-4 mb-1 border-b p-4"
    >
      <Container className="flex items-center justify-between p-0">
        <div className="flex w-full flex-col divide-y divide-dashed">
          <div className="flex items-center gap-2 px-6 py-4">
            <ExclamationCircleSolid className="text-blue-500" />
            <Heading level="h2">{t("orders.edits.panel.title")}</Heading>
          </div>

          {/*ADDED ITEMS*/}
          <div className="txt-small text-ui-fg-subtle flex flex-row px-6 py-4">
            <span className="flex-1 font-medium">{t("labels.added")}</span>
            <div className="flex-1">TODO</div>
          </div>

          {/*REMOVED ITEMS*/}
          <div className="txt-small text-ui-fg-subtle flex flex-row px-6 py-4">
            <span className="flex-1 font-medium">{t("labels.removed")}</span>
            <div className="flex-1">TODO</div>
          </div>

          <div className="bg-ui-bg-subtle flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
            <Button
              size="small"
              variant="secondary"
              onClick={onConfirmOrderEdit}
            >
              {t("actions.forceConfirm")}
            </Button>
            <Button
              size="small"
              variant="secondary"
              onClick={onCancelOrderEdit}
            >
              {t("actions.cancel")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
