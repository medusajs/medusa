import { CartDTO, ShippingMethodDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

type HandlerInput = {
  cart: CartDTO
}

type HandlerOutput = {
  lineItems: any[]
}

function validateLineItemShipping(
  shippingMethods: ShippingMethodDTO[],
  lineItem: any // TODO: LineItemDTO
): boolean {
  const lineItemShippingProfiledId = lineItem.variant.product.profile_id
  if (!lineItemShippingProfiledId) {
    return true
  }

  if (shippingMethods && shippingMethods.length) {
    return shippingMethods.some(
      ({ shipping_option }) =>
        shipping_option.profile_id === lineItemShippingProfiledId
    )
  }

  return false
}

export async function ensureCorrectLineItemShipping({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInput>): Promise<HandlerOutput> {
  const { manager } = context

  const { cart } = data

  if (!cart?.items?.length || !cart.shipping_methods?.length) {
    return {
      lineItems: [],
    }
  }

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    cart.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: validateLineItemShipping(cart.shipping_methods!, item),
      })
    })
  )

  return {
    lineItems: items,
  }
}

ensureCorrectLineItemShipping.aliases = {
  cart: "cart",
}
