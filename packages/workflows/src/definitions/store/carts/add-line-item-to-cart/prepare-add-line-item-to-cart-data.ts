import {
  AddLineItemVariantToCartDTO,
  CartDTO,
  WorkflowTypes,
} from "@medusajs/types"
import { WorkflowDataPreparationArguments } from "../../../../helper"

type PreparationHandlerInput =
  WorkflowTypes.CartWorkflow.AddLineItemToCartWorkflowDTO

type PreparationHandlerOutput = {
  cart: CartDTO
  variantToLineItemsMap: Map<string, AddLineItemVariantToCartDTO>
  context: {
    region_id: string
    customer_id?: string
  }
}

export async function prepareAddLineItemToCartWorkflowData({
  container,
  context,
  data,
}: // eslint-disable-next-line max-len
WorkflowDataPreparationArguments<PreparationHandlerInput>): Promise<PreparationHandlerOutput> {
  const { manager } = context

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(data.cart_id, {
    select: ["id", "region_id", "customer_id"],
  })

  const variantToLineItemsMap = new Map(
    data.line_items.map((item) => [
      item.variant_id,
      {
        variant_id: item.variant_id,
        quantity: item.quantity,
        metadata: item.metadata ?? {},
      },
    ])
  ) as PreparationHandlerOutput["variantToLineItemsMap"]

  return {
    cart,
    variantToLineItemsMap,
    context: {
      region_id: cart.region_id,
      customer_id: cart.customer_id,
    },
  }
}
