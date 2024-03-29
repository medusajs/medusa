import { humanizeAmount } from "medusa-core-utils"
import { gatherSwapReport } from "../utils/gather-swap-report"

export default async function handler({
  data: { id, fulfillment_id },
  container,
}) {
  const segmentService = container.resolve("segmentService")
  const fulfillmentService = container.resolve("fulfillmentService")
  const swapService = container.resolve("swapService")
  const lineItemService = container.resolve("lineItemService")

  const [swap, swapReport] = await gatherSwapReport(id, {
    swapService,
    segmentService,
    lineItemService,
  })
  const fulfillment = await fulfillmentService.retrieve(fulfillment_id)

  const currency = swapReport.currency
  const total = humanizeAmount(swap.difference_due, currency)
  const reporting_total = await segmentService.getReportingValue(
    currency,
    total
  )

  return await segmentService.track({
    event: "Swap Shipped",
    userId: swap.order.customer_id,
    timestamp: fulfillment.shipped_at,
    properties: {
      reporting_total,
      total,
      ...swapReport,
    },
  })
}

export const config = {
  event: "swap.shipment_created",
}
