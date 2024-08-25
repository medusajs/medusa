import { ExclamationCircle } from "@medusajs/icons"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { useNavigate } from "react-router-dom"
import { useCancelClaimRequest } from "../../../../../hooks/api/claims"

type ActiveOrderClaimSectionProps = {
  orderPreview: HttpTypes.AdminOrderPreview
}

export const ActiveOrderClaimSection = ({
  orderPreview,
}: ActiveOrderClaimSectionProps) => {
  const { t } = useTranslation()
  const claimId = orderPreview?.order_change?.claim_id

  const { mutateAsync: cancelClaim } = useCancelClaimRequest(
    claimId,
    orderPreview.id
  )

  const navigate = useNavigate()

  const onContinueClaim = async () => {
    navigate(`/orders/${orderPreview.id}/claims`)
  }

  const onCancelClaim = async () => {
    await cancelClaim(undefined, {
      onSuccess: () => {
        toast.success(t("orders.claims.toast.canceledSuccessfully"))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (!claimId) {
    return
  }

  return (
    <div
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
      }}
      className="-m-4 mb-1 border-b p-4"
    >
      <Container className="flex items-center justify-between p-0">
        <div className="flex w-full flex-row divide-y divide-dashed justify-between">
          <div>
            <div className="flex items-center gap-2 px-6 pt-4 mb-2">
              <ExclamationCircle className="text-ui-fg-subtle" />
              <Heading level="h2">{t("orders.claims.panel.title")}</Heading>
            </div>

            <div className="gap-2 px-6 pb-4">
              <Text>{t("orders.claims.panel.description")}</Text>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
            <Button size="small" variant="secondary" onClick={onCancelClaim}>
              {t("actions.cancel")}
            </Button>

            <Button size="small" variant="secondary" onClick={onContinueClaim}>
              {t("actions.continue")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
