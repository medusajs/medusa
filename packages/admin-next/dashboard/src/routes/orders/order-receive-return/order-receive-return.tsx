import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Heading, toast } from "@medusajs/ui"
import { useEffect } from "react"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { RouteDrawer } from "../../../components/modals"

import { OrderReceiveReturnForm } from "./components/order-receive-return-form"
import {
  useAddReceiveItems,
  useInitiateReceiveReturn,
  useReturn,
} from "../../../hooks/api/returns"

let IS_REQUEST_RUNNING = false

export function OrderReceiveReturn() {
  const { id, return_id } = useParams()
  const { t } = useTranslation()

  /**
   * HOOKS
   */

  const { order } = useOrder(id!, { fields: "+currency_code,*items" })
  const { order: preview } = useOrderPreview(id!)
  const { return: orderReturn } = useReturn(return_id, {
    fields: "*items.item,*items.item.variant,*items.item.variant.product",
  }) // TODO: fix API needs to return 404 if return not exists and not an empty object

  /**
   * MUTATIONS
   */

  const { mutateAsync: initiateReceiveReturn } = useInitiateReceiveReturn(
    return_id,
    id
  )

  const { mutateAsync: addReceiveItems } = useAddReceiveItems(return_id, id)

  useEffect(() => {
    ;(async function () {
      if (IS_REQUEST_RUNNING || !preview || !orderReturn) {
        return
      }

      if (preview.order_change) {
        return
      }

      IS_REQUEST_RUNNING = true

      try {
        await initiateReceiveReturn({})

        await addReceiveItems({
          items: orderReturn.items.map((i) => ({
            id: i.item_id,
            quantity: i.quantity,
          })),
        })
      } catch (e) {
        toast.error(e.message)
      }

      IS_REQUEST_RUNNING = false
    })()
  }, [preview, orderReturn])

  const ready = order && orderReturn && preview

  if (orderReturn && orderReturn?.status !== "requested") {
    throw new Error("This return cannot be received.")
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.receiveReturn.title")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <OrderReceiveReturnForm
          order={order}
          orderReturn={orderReturn}
          preview={preview}
        />
      )}
    </RouteDrawer>
  )
}
