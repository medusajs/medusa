import type { FulfillmentStatus } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../common/status-cell"

type FulfillmentStatusCellProps = {
  status: FulfillmentStatus
}

export const FulfillmentStatusCell = ({
  status,
}: FulfillmentStatusCellProps) => {
  const { t } = useTranslation()

  const [label, color] = {
    not_fulfilled: [t("orders.fulfillmentStatus.notFulfilled"), "red"],
    partially_fulfilled: [
      t("orders.fulfillmentStatus.partiallyFulfilled"),
      "orange",
    ],
    fulfilled: [t("orders.fulfillmentStatus.fulfilled"), "green"],
    partially_shipped: [
      t("orders.fulfillmentStatus.partiallyShipped"),
      "orange",
    ],
    shipped: [t("orders.fulfillmentStatus.shipped"), "green"],
    partially_returned: [
      t("orders.fulfillmentStatus.partiallyReturned"),
      "orange",
    ],
    returned: [t("orders.fulfillmentStatus.returned"), "green"],
    canceled: [t("orders.fulfillmentStatus.canceled"), "red"],
    requires_action: [t("orders.fulfillmentStatus.requresAction"), "orange"],
  }[status] as [string, "red" | "orange" | "green"]

  return <StatusCell color={color}>{label}</StatusCell>
}

export const FulfillmentStatusHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.fulfillment")}</span>
    </div>
  )
}
