import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useInitiateReturn, useReturn } from "../../../hooks/api/returns"
import { DEFAULT_FIELDS } from "../order-detail/constants"

let IS_REQUEST_RUNNING = false

export const ReturnCreate = () => {
  const { id } = useParams()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)

  const [activeReturnId, setActiveReturnId] = useState()

  const { mutateAsync: initiateReturn } = useInitiateReturn(order.id)

  const { return: activeReturn } = useReturn(activeReturnId, undefined, {
    enabled: !!activeReturnId,
  })

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order || !preview) {
        return
      }

      /**
       * Active return already exists
       */
      if (preview.order_change.change_type === "return") {
        setActiveReturnId(preview.order_change.return.id)
        return
      }

      IS_REQUEST_RUNNING = true

      const orderReturn = await initiateReturn({ order_id: order.id })
      setActiveReturnId(orderReturn.id)

      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order, preview])

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
