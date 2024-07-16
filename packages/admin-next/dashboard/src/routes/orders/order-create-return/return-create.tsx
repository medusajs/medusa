import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useInitiateReturn } from "../../../hooks/api/returns"
import { DEFAULT_FIELDS } from "../order-detail/constants"

let IS_REQUEST_RUNNING = false

export const ReturnCreate = () => {
  const { id } = useParams()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)

  const [activeReturn, setActiveReturn] = useState()
  const { mutateAsync: initiateReturn, isPending } = useInitiateReturn(order.id)

  /**
   * TODO: get active return here ??
   */

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order) return

      IS_REQUEST_RUNNING = true
      let orderReturn
      try {
        orderReturn = await initiateReturn({ order_id: order.id })
      } catch (e) {
        // TODO: remove this catch
        orderReturn = {
          id: "return_01J2XHSK4DWP2Y6NJBMMRDW497",
          order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
          exchange_id: null,
          claim_id: null,
          display_id: 27,
          order_version: 3,
          status: "requested",
          refund_amount: null,
          created_at: "2024-07-16T10:35:45.166Z",
          updated_at: "2024-07-16T10:35:45.166Z",
        }
      }

      setActiveReturn(orderReturn)
      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order])

  return (
    <RouteFocusModal>
      {activeReturn && preview && (
        <ReturnCreateForm
          order={order}
          activeReturn={activeReturn}
          preview={preview}
        />
      )}
    </RouteFocusModal>
  )
}
