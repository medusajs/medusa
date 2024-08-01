import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import { toast } from "@medusajs/ui"

import { RouteFocusModal } from "../../../components/modals"
import { ClaimCreateForm } from "./components/claim-create-form"

import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useClaim, useClaims, useCreateClaim } from "../../../hooks/api/claims"
import { DEFAULT_FIELDS } from "../order-detail/constants"

let IS_REQUEST_RUNNING = false

export const ClaimCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)

  const [activeClaimId, setActiveClaimId] = useState()

  const { mutateAsync: createClaim } = useCreateClaim(order.id)

  // TODO: GET /claims/:id is not implemented
  // const { claim } = useClaim(activeClaimId, undefined, {
  //   enabled: !!activeClaimId,
  // })

  // TEMP HACK: until the endpoint above is implemented
  const { claims } = useClaims(undefined, {
    enabled: !!activeClaimId,
    limit: 999,
  })

  const claim = useMemo(() => {
    if (claims) {
      return claims.find((c) => c.id === activeClaimId)
    }
  }, [claims])

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !order || !preview) {
        return
      }

      /**
       * Active claim already exists
       */
      if (preview.order_change?.change_type === "claim") {
        setActiveClaimId(preview.order_change.claim_id)
        return
      }

      if (
        preview.order_change &&
        preview.order_change.change_type !== "claim"
      ) {
        navigate(`/orders/${order.id}`, { replace: true })
        toast.error(t("orders.claims.activeChangeError"))
        return
      }

      IS_REQUEST_RUNNING = true

      try {
        const { claim } = await createClaim({
          order_id: order.id,
          type: "replace",
        })
        setActiveClaimId(claim.id)
      } catch (e) {
        navigate(`/orders/${order.id}`, { replace: true })
        toast.error(e.message)
      } finally {
        IS_REQUEST_RUNNING = false
      }
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
