import {
  Button,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  toast,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ExclamationCircleSolid } from "@medusajs/icons"

import { useOrderPreview } from "../../../../../hooks/api"
import {
  useCancelOrderEdit,
  useConfirmOrderEdit,
} from "../../../../../hooks/api/order-edits"
import { useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { Thumbnail } from "../../../../../components/common/thumbnail"

type OrderActiveEditSectionProps = {
  orderId: string
}

function EditItem({ item }: { item: HttpTypes.AdminOrderLineItem }) {
  return (
    <div key={item.id} className="text-ui-fg-subtle items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <div className="w-fit min-w-[27px]">
          <span className="txt-small tabular-nums">{item.quantity}</span>x
        </div>

        <Thumbnail src={item.thumbnail} />

        <span className="txt-small txt-subtile font-medium">{item.title}</span>

        {item.variant_sku && " · "}

        {item.variant_sku && (
          <div className="flex items-center gap-x-1">
            <span className="txt-small">{item.variant_sku}</span>
            <Copy content={item.variant_sku} className="text-ui-fg-muted" />
          </div>
        )}
      </div>
    </div>
  )
}

export const OrderActiveEditSection = ({
  orderId,
}: OrderActiveEditSectionProps) => {
  const { t } = useTranslation()

  const { order: orderPreview } = useOrderPreview(orderId)

  const { mutateAsync: cancelOrderEdit } = useCancelOrderEdit(orderId)
  const { mutateAsync: confirmOrderEdit } = useConfirmOrderEdit(orderId)

  const addedItems = useMemo(() => {
    return (orderPreview?.items || []).filter(
      (i) => !!i.actions?.find((a) => a.action === "ITEM_ADD")
    )
  }, [orderPreview])

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

  if (!orderPreview || orderPreview.order_change?.change_type !== "edit") {
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

            <div className="flex flex-1 flex-col gap-y-2">
              {addedItems.map((item) => (
                <EditItem key={item.id} item={item} />
              ))}
            </div>
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
