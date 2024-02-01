import type { PaymentStatus } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../common/status-cell"

type PaymentStatusCellProps = {
  status: PaymentStatus
}

export const PaymentStatusCell = ({ status }: PaymentStatusCellProps) => {
  const { t } = useTranslation()

  const [label, color] = {
    not_paid: [t("orders.paymentStatus.notPaid"), "red"],
    awaiting: [t("orders.paymentStatus.awaiting"), "orange"],
    captured: [t("orders.paymentStatus.captured"), "green"],
    refunded: [t("orders.paymentStatus.refunded"), "green"],
    partially_refunded: [t("orders.paymentStatus.partiallyRefunded"), "orange"],
    canceled: [t("orders.paymentStatus.canceled"), "red"],
    requires_action: [t("orders.paymentStatus.requresAction"), "orange"],
  }[status] as [string, "red" | "orange" | "green"]

  return <StatusCell color={color}>{label}</StatusCell>
}

export const PaymentStatusHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.payment")}</span>
    </div>
  )
}
