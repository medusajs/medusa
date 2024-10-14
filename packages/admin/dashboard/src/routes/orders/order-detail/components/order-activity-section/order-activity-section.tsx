import { AdminOrder } from "@medusajs/types"
import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { OrderTimeline } from "./order-timeline"

type OrderActivityProps = {
  order: AdminOrder
}

export const OrderActivitySection = ({ order }: OrderActivityProps) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col gap-y-8 px-6 py-4">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">{t("orders.activity.header")}</Heading>
        </div>
        {/* TODO: Re-add when we have support for notes */}
        {/* <OrderNoteForm order={order} /> */}
      </div>
      <OrderTimeline order={order} />
    </Container>
  )
}
