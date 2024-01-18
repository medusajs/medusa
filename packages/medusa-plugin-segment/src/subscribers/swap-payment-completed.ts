import { humanizeAmount } from "medusa-core-utils"
import { gatherSwapReport } from "../utils/gather-swap-report"

export default async function handler({ data: { id }, container }) {
  const swapService = container.resolve("swapService")
  const segmentService = container.resolve("segmentService")
  const lineItemService = container.resolve("lineItemService")

  const [swap, swapReport] = await gatherSwapReport(id, {
    swapService,
    segmentService,
    lineItemService,
  })

  const currency = swapReport.currency
  const total = humanizeAmount(swap.difference_due, currency)
  const reporting_total = await segmentService.getReportingValue(
    currency,
    total
  )

  return await segmentService.track({
    event: "Swap Confirmed",
    userId: swap.order.customer_id,
    timestamp: swap.confirmed_at,
    properties: {
      reporting_total,
      total,
      ...swapReport,
    },
  })
}

export const config = {
  event: "swap.payment_completed",
}
