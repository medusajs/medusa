import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder } from "../../../hooks/api/orders"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { useInitiateReturn } from "../../../hooks/api/returns"

let IS_REQUEST_RUNNING = false

export const ReturnCreate = () => {
  const { id } = useParams()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const [activeReturn, setActiveReturn] = useState()
  const { mutateAsync: initiateReturn, isPending } = useInitiateReturn()

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
          id: "return_01J2VKB5RFWX79FAS80NFH59A3",
          order_id: "order_01J1YDQZVBHNM982M1HV4YVS2G",
          exchange_id: null,
          claim_id: null,
          display_id: 9,
          order_version: 3,
          status: "requested",
          refund_amount: null,
          created_at: "2024-07-15T16:24:21.007Z",
          updated_at: "2024-07-15T16:24:21.007Z",
          items: [],
          shipping_methods: [],
        }

        setActiveReturn(orderReturn)
      }
      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order])

  return (
    <RouteFocusModal>
      {activeReturn && (
        <ReturnCreateForm
          order={order}
          activeReturn={activeReturn}
          preview={null /* TODO */}
        />
      )}
    </RouteFocusModal>
  )
}
