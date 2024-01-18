import { humanizeAmount } from "medusa-core-utils"

export async function gatherSwapReport(
  id,
  { swapService, segmentService, lineItemService }
) {
  const swap = await swapService.retrieve(id, {
    relations: [
      "order",
      "additional_items",
      "additional_items.variant",
      "return_order",
      "return_order.items",
      "return_order.shipping_method",
    ],
  })

  const currency = swap.order.currency_code

  const newItems = await Promise.all(
    swap.additional_items.map(async (i) => {
      const price = humanizeAmount(i.unit_price, currency)
      const reporting_price = await segmentService.getReportingValue(
        currency,
        price
      )

      return {
        name: i.title,
        product_id: i.variant.product_id,
        variant: i.variant.sku,
        quantity: i.quantity,
        price,
        reporting_price,
      }
    })
  )

  const returnItems = await Promise.all(
    swap.return_order.items.map(async (ri) => {
      const i = await lineItemService.retrieve(ri.item_id, {
        relations: ["variant"],
      })
      const price = humanizeAmount(i.unit_price, currency)
      const reporting_price = await segmentService.getReportingValue(
        currency,
        price
      )

      return {
        name: i.title,
        product_id: i.variant.product_id,
        variant: i.variant.sku,
        quantity: ri.quantity,
        price,
        reporting_price,
      }
    })
  )

  return [
    swap,
    {
      swap_id: swap.id,
      order_id: swap.order_id,
      new_items: newItems,
      return_items: returnItems,
      currency,
    },
  ]
}
