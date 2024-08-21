import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { OrderEditCreateForm } from "./components/order-edit-create-form"
import { useCreateOrderEdit } from "../../../hooks/api/order-edits"

let IS_REQUEST_RUNNING = false

export const OrderEditCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)
  const { mutateAsync: createOrderEdit } = useCreateOrderEdit(order.id)

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !preview) {
        return
      }

      if (preview.order_change) {
        if (preview.order_change.change_type !== "edit") {
          navigate(`/orders/${preview.id}`, { replace: true })
          toast.error(t("orders.edits.activeChangeError"))
        }

        return
      }

      IS_REQUEST_RUNNING = true

      try {
        const { order } = await createOrderEdit({
          order_id: preview.id,
        })
      } catch (e) {
        toast.error(e.message)
        navigate(`/orders/${preview.id}`, { replace: true })
      } finally {
        IS_REQUEST_RUNNING = false
      }
    }

    run()
  }, [preview])

  return (
    <RouteFocusModal>
      {preview && order && (
        <OrderEditCreateForm order={order} preview={preview} />
      )}
    </RouteFocusModal>
  )
}
