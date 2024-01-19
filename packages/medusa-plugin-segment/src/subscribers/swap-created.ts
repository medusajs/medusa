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

  return await segmentService.track({
    event: "Swap Created",
    userId: swap.order.customer_id,
    timestamp: swap.created_at,
    properties: swapReport,
  })
}

export const config = {
  event: "swap.created",
}
