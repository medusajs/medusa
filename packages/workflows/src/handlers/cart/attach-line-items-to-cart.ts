import { InputAlias } from "../../definitions"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

export async function attachLineItemsToCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const featureFlagRouter = container.resolve("featureFlagRouter")
  const lineItemService = container.resolve("lineItemService")
  const cartService = container.resolve("cartService")
  const lineItemServiceTx = lineItemService
    // .withTransaction(manager)
  const cartServiceTx = cartService
    // .withTransaction(manager)
  const lineItems = data[InputAlias.Cart].items

  if (lineItems?.length) {
    const generateInputData = lineItems.map((item) => ({
      variantId: item.variant_id,
      quantity: item.quantity,
    }))

    const generatedLineItems = await lineItemServiceTx.generate(
      generateInputData,
      {
        region_id: data[InputAlias.Cart].region_id,
        customer_id: data[InputAlias.Cart].customer_id,
      }
    )

    await cartServiceTx.addOrUpdateLineItems(
      data[InputAlias.Cart].id,
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
