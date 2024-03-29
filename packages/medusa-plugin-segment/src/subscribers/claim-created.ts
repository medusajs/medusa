export default async function handler({ data: { id }, container }) {
  const segmentService = container.resolve("segmentService")
  const claimService = container.resolve("claimService")

  const claim = await claimService.retrieve(id, {
    relations: [
      "order",
      "claim_items",
      "claim_items.item",
      "claim_items.tags",
      "claim_items.variant",
    ],
  })

  for (const ci of claim.claim_items) {
    const price = ci.item.unit_price / 100
    const reporting_price = await segmentService.getReportingValue(
      claim.order.currency_code,
      price
    )
    const event = {
      event: "Item Claimed",
      userId: claim.order.customer_id,
      timestamp: claim.created_at,
      properties: {
        price,
        reporting_price,
        order_id: claim.order_id,
        claim_id: claim.id,
        claim_item_id: ci.id,
        type: claim.type,
        quantity: ci.quantity,
        variant: ci.variant.sku,
        product_id: ci.variant.product_id,
        reason: ci.reason,
        note: ci.note,
        tags: ci.tags.map((t) => ({ id: t.id, value: t.value })),
      },
    }
    await segmentService.track(event)
  }
}

export const config = {
  event: "claim.created",
}
