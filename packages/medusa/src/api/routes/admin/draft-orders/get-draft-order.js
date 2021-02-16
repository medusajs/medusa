import { defaultRelations, defaultFields } from "."

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const cartService = req.scope.resolve("cartService")

    const draftOrder = await draftOrderService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    draftOrder.cart = await cartService.retrieve(draftOrder.cart_id, {
      relations: [
        "gift_cards",
        "region",
        "items",
        "payment",
        "shipping_address",
        "billing_address",
        "region.countries",
        "region.payment_providers",
        "shipping_methods",
        "payment_sessions",
        "shipping_methods.shipping_option",
        "discounts",
      ],
      select: [
        "subtotal",
        "tax_total",
        "shipping_total",
        "discount_total",
        "gift_card_total",
        "total",
      ],
    })

    res.json({ draft_order: draftOrder })
  } catch (error) {
    throw error
  }
}
