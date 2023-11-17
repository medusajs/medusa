import { CartDTO, ShippingMethodDTO } from "@medusajs/types"
import { StepExecutionContext, createStep } from "../../../../../utils/composer"

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

export const validateLineItemShippingStep = createStep(
  "validateLineItemShipping",
  async function (
    input: InvokeInput,
    executionContext: StepExecutionContext
  ): Promise<InvokeOutput> {
    const { cart } = input
    const manager = executionContext.context.manager
    const container = executionContext.container

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
)

// TODO: Add compensate function
