import { useTranslation } from "react-i18next"

import { FulfillmentStatus } from "@medusajs/types"

import { getOrderFulfillmentStatus } from "../../../../../lib/order-helpers"
import { StatusCell } from "../../common/status-cell"

type FulfillmentStatusCellProps = {
  status: FulfillmentStatus
}

export const FulfillmentStatusCell = ({
  status,
}: FulfillmentStatusCellProps) => {
  const { t } = useTranslation()

  if (!status) {
    // TODO: remove this once fulfillment<>order link is added
    return "-"
  }

  const { label, color } = getOrderFulfillmentStatus(t, status)

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
