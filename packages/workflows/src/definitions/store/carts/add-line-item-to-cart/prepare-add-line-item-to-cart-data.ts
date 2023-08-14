import { WorkflowTypes } from "@medusajs/types"
import { WorkflowDataPreparationArguments } from "../../../../helper"

type AddLineItemInputData =
  WorkflowTypes.CartWorkflow.AddLineItemToCartWorkflowDTO

export async function prepareAddLineItemToCartWorkflowData({
  container,
  context,
  data,
}: WorkflowDataPreparationArguments<AddLineItemInputData>) {
  const { manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(data.cart_id, {
    select: ["id", "region_id", "customer_id"],
  })

  const variantToLineItemsMap = new Map(
    data.line_items.map((item) => [
      item.variant_id,
      {
        ...item,
        region_id: cart.region_id,
        customer_id: item.customer_id || cart.customer_id,
      },
    ])
  )

  return {
    cart,
    variantToLineItemsMap,
  }
}
