import type { Order } from "@medusajs/medusa"
import { StatusBadge } from "@medusajs/ui"
import { format } from "date-fns"
import { getPresentationalAmount } from "../../../lib/money-amount-helpers"

export const OrderDisplayIdCell = ({ id }: { id: Order["display_id"] }) => {
  return <span>#{id}</span>
}

export const OrderDateCell = ({
  date,
}: {
  date: Order["created_at"] | string
}) => {
  const value = new Date(date)

  return <span>{format(value, "dd MMM, yyyy")}</span>
}

export const OrderFulfillmentStatusCell = ({
  status,
}: {
  status: Order["fulfillment_status"]
}) => {
  switch (status) {
    case "not_fulfilled":
      return <StatusBadge color="grey">Not fulfilled</StatusBadge>
    case "partially_fulfilled":
      return <StatusBadge color="orange">Partially fulfilled</StatusBadge>
    case "fulfilled":
      return <StatusBadge color="green">Fulfilled</StatusBadge>
    case "partially_shipped":
      return <StatusBadge color="orange">Partially shipped</StatusBadge>
    case "shipped":
      return <StatusBadge color="green">Shipped</StatusBadge>
    case "partially_returned":
      return <StatusBadge color="orange">Partially returned</StatusBadge>
    case "returned":
      return <StatusBadge color="green">Returned</StatusBadge>
    case "canceled":
      return <StatusBadge color="red">Canceled</StatusBadge>
    case "requires_action":
      return <StatusBadge color="orange">Requires action</StatusBadge>
  }
}

export const OrderPaymentStatusCell = ({
  status,
}: {
  status: Order["payment_status"]
}) => {
  switch (status) {
    case "not_paid":
      return <StatusBadge color="grey">Not paid</StatusBadge>
    case "awaiting":
      return <StatusBadge color="orange">Awaiting</StatusBadge>
    case "captured":
      return <StatusBadge color="green">Captured</StatusBadge>
    case "partially_refunded":
      return <StatusBadge color="orange">Partially refunded</StatusBadge>
    case "refunded":
      return <StatusBadge color="green">Refunded</StatusBadge>
    case "canceled":
      return <StatusBadge color="red">Canceled</StatusBadge>
    case "requires_action":
      return <StatusBadge color="orange">Requires action</StatusBadge>
  }
}

// TODO: Fix formatting amount with correct division eg. EUR 1000 -> EUR 10.00
// Source currency info from `@medusajs/medusa` definition
export const OrderTotalCell = ({
  total,
  currencyCode,
}: {
  total: Order["total"]
  currencyCode: Order["currency_code"]
}) => {
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(0)

  const symbol = formatted.replace(/\d/g, "").replace(/[.,]/g, "").trim()

  const presentationAmount = getPresentationalAmount(total, currencyCode)
  const formattedTotal = new Intl.NumberFormat(undefined, {
    style: "decimal",
  }).format(presentationAmount)

  return (
    <span>
      {symbol} {formattedTotal} {currencyCode.toUpperCase()}
    </span>
  )
}
