import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { toast } from "@medusajs/ui"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useInitiateReturn, useReturn } from "../../../hooks/api/returns"
import { DEFAULT_FIELDS } from "../order-detail/constants"

let IS_REQUEST_RUNNING = false

export const ReturnCreate = () => {
  const { id } = useParams()

  const navigate = useNavigate()
  const { t } = useTranslation()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!, undefined, {})

  const [activeReturnId, setActiveReturnId] = useState()

  const { mutateAsync: initiateReturn } = useInitiateReturn(order.id)

  const { return: activeReturn } = useReturn(activeReturnId, undefined, {
    enabled: !!activeReturnId,
  })

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !preview) {
        return
      }

      if (preview.order_change) {
        if (preview.order_change.change_type === "return_request") {
          setActiveReturnId(preview.order_change.return_id)
        } else {
          navigate(`/orders/${order.id}`, { replace: true })
          toast.error(t("orders.returns.activeChangeError"))
        }

        return
      }

      IS_REQUEST_RUNNING = true

      try {
        const orderReturn = await initiateReturn({ order_id: order.id })
        setActiveReturnId(orderReturn.id)
      } catch (e) {
        navigate(`/orders/${order.id}`, { replace: true })
        toast.error(e.message)
      } finally {
        IS_REQUEST_RUNNING = false
      }
    }

    run()
  }, [preview])

  return (
    <RouteFocusModal>
      {activeReturn && preview && order && (
        <ReturnCreateForm
          order={order}
          activeReturn={activeReturn}
          preview={preview}
        />
      )}
    </RouteFocusModal>
  )
}
