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
  let lineItems = data[CartInputAlias.Cart].items

  if (lineItems?.length) {
    const generateInputData = lineItems.map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    }))

    lineItems = await lineItemServiceTx.generate(
      generateInputData,
      {
        region_id: data[CartInputAlias.CreatedCart].region_id,
        customer_id: data[CartInputAlias.CreatedCart].customer_id,
      }
    )

    await cartServiceTx.addOrUpdateLineItems(
      data[CartInputAlias.CreatedCart].id,
      lineItems,
      {
        validateSalesChannels:
          featureFlagRouter.isFeatureEnabled("sales_channels"),
      }
    )
  }

  return lineItems
}
