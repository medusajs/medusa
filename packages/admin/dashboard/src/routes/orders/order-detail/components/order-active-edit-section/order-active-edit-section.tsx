import { Button, Container, Copy, Heading, toast } from "@medusajs/ui"
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
import { useNavigate } from "react-router-dom"

type OrderActiveEditSectionProps = {
  order: HttpTypes.AdminOrder
  quantity: number
}

function EditItem({
  item,
  quantity,
}: {
  item: HttpTypes.AdminOrderLineItem
  quantity: number
}) {
  return (
    <div key={item.id} className="text-ui-fg-subtle items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <div className="w-fit min-w-[27px]">
          <span className="txt-small tabular-nums">{quantity}</span>x
        </div>

        <Thumbnail src={item.thumbnail} />

        <span className="txt-small text-ui-fg-subtle font-medium">
          {item.title}
        </span>

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
  order,
}: OrderActiveEditSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { order: orderPreview } = useOrderPreview(order.id)

  const { mutateAsync: cancelOrderEdit } = useCancelOrderEdit(order.id)
  const { mutateAsync: confirmOrderEdit } = useConfirmOrderEdit(order.id)

  const isPending = orderPreview.order_change?.status === "pending"

  const [addedItems, removedItems] = useMemo(() => {
    const added = []
    const removed = []

    const orderLookupMap = new Map(order.items!.map((i) => [i.id, i]))

    ;(orderPreview?.items || []).forEach((currentItem) => {
      const originalItem = orderLookupMap.get(currentItem.id)

      if (!originalItem) {
        added.push({ item: currentItem, quantity: currentItem.quantity })
        return
      }

      if (originalItem.quantity > currentItem.quantity) {
        removed.push({
          item: currentItem,
          quantity: originalItem.quantity - currentItem.quantity,
        })
      }

      if (originalItem.quantity < currentItem.quantity) {
        added.push({
          item: currentItem,
          quantity: currentItem.quantity - originalItem.quantity,
        })
      }
    })

    return [added, removed]
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
      className="-m-4 mb-1 border-b border-l p-4"
    >
      <Container className="flex items-center justify-between p-0">
        <div className="flex w-full flex-col divide-y divide-dashed">
          <div className="flex items-center gap-2 px-6 py-4">
            <ExclamationCircleSolid className="text-blue-500" />
            <Heading level="h2">
              {t(
                isPending
                  ? "orders.edits.panel.titlePending"
                  : "orders.edits.panel.title"
              )}
            </Heading>
          </div>

          {/*ADDED ITEMS*/}
          {!!addedItems.length && (
            <div className="txt-small text-ui-fg-subtle flex flex-row px-6 py-4">
              <span className="flex-1 font-medium">{t("labels.added")}</span>

              <div className="flex flex-1 flex-col gap-y-2">
                {addedItems.map(({ item, quantity }) => (
                  <EditItem key={item.id} item={item} quantity={quantity} />
                ))}
              </div>
            </div>
          )}

          {/*REMOVED ITEMS*/}
          {!!removedItems.length && (
            <div className="txt-small text-ui-fg-subtle flex flex-row px-6 py-4">
              <span className="flex-1 font-medium">{t("labels.removed")}</span>

              <div className="flex flex-1 flex-col gap-y-2">
                {removedItems.map(({ item, quantity }) => (
                  <EditItem key={item.id} item={item} quantity={quantity} />
                ))}
              </div>
            </div>
          )}

          <div className="bg-ui-bg-subtle flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
            {isPending ? (
              <Button
                size="small"
                variant="secondary"
                onClick={() => navigate(`/orders/${order.id}/edits`)}
              >
                {t("actions.continueEdit")}
              </Button>
            ) : (
              <Button
                size="small"
                variant="secondary"
                onClick={onConfirmOrderEdit}
              >
                {t("actions.forceConfirm")}
              </Button>
            )}
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
