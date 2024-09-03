import { ArrowPath } from "@medusajs/icons"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { useNavigate } from "react-router-dom"
import { useCancelExchangeRequest } from "../../../../../hooks/api/exchanges"

type ActiveOrderExchangeSectionProps = {
  orderPreview: HttpTypes.AdminOrderPreview
}

export const ActiveOrderExchangeSection = ({
  orderPreview,
}: ActiveOrderExchangeSectionProps) => {
  const { t } = useTranslation()
  const exchangeId = orderPreview?.order_change?.exchange_id

  const { mutateAsync: cancelExchange } = useCancelExchangeRequest(
    exchangeId,
    orderPreview.id
  )

  const navigate = useNavigate()

  const onContinueExchange = async () => {
    navigate(`/orders/${orderPreview.id}/exchanges`)
  }

  const onCancelExchange = async () => {
    await cancelExchange(undefined, {
      onSuccess: () => {
        toast.success(t("orders.exchanges.toast.canceledSuccessfully"))
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (!exchangeId) {
    return
  }

  return (
    <div
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
      }}
      className="-m-4 mb-1 border-b border-l p-4"
    >
      <Container className="flex items-center justify-between p-0">
        <div className="flex w-full flex-row justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 px-6 pt-4">
              <ArrowPath className="text-ui-fg-subtle" />
              <Heading level="h2">{t("orders.exchanges.panel.title")}</Heading>
            </div>

            <div className="gap-2 px-6 pb-4">
              <Text>{t("orders.exchanges.panel.description")}</Text>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-2 rounded-b-xl px-4 py-4">
            <Button size="small" variant="secondary" onClick={onCancelExchange}>
              {t("orders.exchanges.cancel.title")}
            </Button>

            <Button
              size="small"
              variant="secondary"
              onClick={onContinueExchange}
            >
              {t("actions.continue")}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
