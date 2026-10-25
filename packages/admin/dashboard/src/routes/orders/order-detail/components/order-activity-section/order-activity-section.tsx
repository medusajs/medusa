import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ResourceNotesSection } from "../../../../../components/common/resource-notes-section"
import { OrderTimeline } from "./order-timeline"
import { ExtendedOrder } from "../../constants"

type OrderActivityProps = {
  order: ExtendedOrder
}

export const OrderActivitySection = ({ order }: OrderActivityProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-y-3">
      <ResourceNotesSection resourceType="order" resourceId={order.id} />
      <Container className="flex flex-col gap-y-8 px-6 py-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">{t("orders.activity.header")}</Heading>
        </div>
        <OrderTimeline order={order} />
      </Container>
    </div>
  )
}
