import { CartDTO, ShippingMethodDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../../../../helper"
import { createStep } from "../../../../../utils/composer"

type InvokeInput = {
  cart: CartDTO
}

type InvokeOutput = {
  lineItems: any[]
}

function validateLineItemShipping_(
  shippingMethods: ShippingMethodDTO[],
  lineItem: any // TODO: Add LineItemDTO in @medusajs/types
): boolean {
  const itemProfileId = lineItem.variant.product.profile_id
  if (!itemProfileId) {
    return true
  }

  if (shippingMethods && shippingMethods.length) {
    return shippingMethods.some(
      ({ shipping_option }) => shipping_option.profile_id === itemProfileId
    )
  }

  return false
}

async function invoke({
  container,
  context,
  data,
}: WorkflowArguments<InvokeInput>): Promise<InvokeOutput> {
  const { manager } = context

  const { cart } = data

  if (!cart?.items?.length) {
    return {
      lineItems: [],
    }
  }

  if (!cart.shipping_methods?.length) {
    return {
      lineItems: cart.items,
    }
  }

  const lineItemService = container
    .resolve("lineItemService")
    .withTransaction(manager)

  const items = await Promise.all(
    cart.items.map(async (item) => {
      return lineItemService.update(item.id, {
        has_shipping: validateLineItemShipping_(cart.shipping_methods!, item),
      })
    })
  )

  return {
    lineItems: items,
  }
}

export const validateLineItemShippingStep = createStep(
  "createShippingMethods",
  invoke
)
