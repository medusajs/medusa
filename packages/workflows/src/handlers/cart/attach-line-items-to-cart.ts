import { WorkflowArguments } from "../../helper"

enum Aliases {
  Cart = "cart",
  CreatedCart = "createdCart",
}

export async function attachLineItemsToCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<void> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const lineItemService = container.resolve("lineItemService")
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const lineItemServiceTx = lineItemService
    .withTransaction(entityManager)
  const cartServiceTx = cartService
    .withTransaction(entityManager)
  let lineItems = data[Aliases.Cart].items

  if (lineItems?.length) {
    const generateInputData = lineItems.map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    }))

    lineItems = await lineItemServiceTx.generate(
      generateInputData,
      {
        region_id: data[Aliases.CreatedCart].region_id,
        customer_id: data[Aliases.CreatedCart].customer_id,
      }
    )

    await cartServiceTx.addOrUpdateLineItems(
      data[Aliases.CreatedCart].id,
      lineItems,
      {
        validateSalesChannels:
          featureFlagRouter.isFeatureEnabled("sales_channels"),
      }
    )
  }
}

attachLineItemsToCart.aliases = Aliases
