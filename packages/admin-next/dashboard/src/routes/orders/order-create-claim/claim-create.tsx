import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { RouteFocusModal } from "../../../components/modals"
import { ClaimCreateForm } from "./components/claim-create-form"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useClaim, useCreateClaim } from "../../../hooks/api/claims"
import { DEFAULT_FIELDS } from "../order-detail/constants"

let IS_REQUEST_RUNNING = false

export const ClaimCreate = () => {
  const { id } = useParams()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)

  const [activeClaimId, setActiveClaimId] = useState()

  const { mutateAsync: createClaim } = useCreateClaim(order.id)

  const { claim } = useClaim(activeClaimId, undefined, {
    enabled: !!activeClaimId,
  })

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order || !preview) {
        return
      }

      /**
       * Active return already exists
       */
      if (preview.order_change?.change_type === "claim") {
        setActiveClaimId(preview.order_change.return.id)
        return
      }

      IS_REQUEST_RUNNING = true

      const claim = await createClaim({ order_id: order.id })
      setActiveClaimId(claim.id)

      IS_REQUEST_RUNNING = false
    }

    run()
  }, [order, preview])

  return (
    <RouteFocusModal>
      {claim && preview && order && (
        <ClaimCreateForm order={order} claim={claim} preview={preview} />
      )}
    </RouteFocusModal>
  )
}
