import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function attachLineItemsToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const lineItemService = container.resolve("lineItemService")
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const lineItemServiceTx = lineItemService
    .withTransaction(entityManager)
  const cartServiceTx = cartService
    .withTransaction(entityManager)
  const lineItems = data[CartInputAlias.Cart].items

  if (lineItems?.length) {
    const generateInputData = lineItems.map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    }))

    const generatedLineItems = await lineItemServiceTx.generate(
      generateInputData,
      {
        region_id: data[CartInputAlias.Cart].region_id,
        customer_id: data[CartInputAlias.Cart].customer_id,
      }
    )

    await cartServiceTx.addOrUpdateLineItems(
      data[CartInputAlias.Cart].id,
      generatedLineItems,
      {
        validateSalesChannels:
          featureFlagRouter.isFeatureEnabled("sales_channels"),
      }
    )

    data['cart'].items = generatedLineItems
  }

  return data['cart']
}
