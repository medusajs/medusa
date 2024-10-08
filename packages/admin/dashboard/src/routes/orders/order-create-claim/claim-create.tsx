import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useClaim, useCreateClaim } from "../../../hooks/api/claims"
import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useReturn } from "../../../hooks/api/returns"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { ClaimCreateForm } from "./components/claim-create-form"

let IS_REQUEST_RUNNING = false

export const ClaimCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)
  const [activeClaimId, setActiveClaimId] = useState<string>()
  const { mutateAsync: createClaim } = useCreateClaim(order.id)

  const { claim } = useClaim(activeClaimId!, undefined, {
    enabled: !!activeClaimId,
  })
  const { return: orderReturn } = useReturn(claim?.return_id!, undefined, {
    enabled: !!claim?.return_id,
  })

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !preview) {
        return
      }

      if (preview.order_change) {
        if (preview.order_change.change_type === "claim") {
          setActiveClaimId(preview.order_change.claim_id)
        } else {
          navigate(`/orders/${preview.id}`, { replace: true })
          toast.error(t("orders.claims.activeChangeError"))
        }

        return
      }

      IS_REQUEST_RUNNING = true

      try {
        const { claim: createdClaim } = await createClaim({
          order_id: preview.id,
          type: "replace",
        })

        setActiveClaimId(createdClaim.id)
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
      {claim && preview && order && (
        <ClaimCreateForm
          order={order}
          claim={claim}
          preview={preview}
          orderReturn={orderReturn}
        />
      )}
    </RouteFocusModal>
  )
}
