import { useParams } from "react-router-dom"
import { useEffect } from "react"

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

  const { mutateAsync: initiateReturn, isPending } = useInitiateReturn()

  /**
   * TODO: get active return here ??
   */

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order) return

      IS_REQUEST_RUNNING = true
      // await initiateReturn()
      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order])

  return (
    <RouteFocusModal>
      {!isPending && (
        <ReturnCreateForm
          order={order}
          return={null /* TODO */}
          preview={null /* TODO */}
        />
      )}
    </RouteFocusModal>
  )
}
