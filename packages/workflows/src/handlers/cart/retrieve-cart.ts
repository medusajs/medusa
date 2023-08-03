import { CartInputAlias } from "../../definition"
import { PipelineHandlerResult, WorkflowArguments } from "../../helper"

// TODO: Figure out a way to handle duplication of this code
// TODO: Figure out a way to handle fields and expand query param.
export const defaultStoreCartRelations = [
  "gift_cards",
  "region",
  "items",
  "items.variant",
  "items.adjustments",
  "payment",
  "shipping_address",
  "billing_address",
  "region.countries",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "discounts.rule",
]

export async function retrieveCart<T>({
  container,
  context,
  data,
}: WorkflowArguments): Promise<PipelineHandlerResult<T>> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.retrieve(
    data[CartInputAlias.Cart]?.id, {
      relations: defaultStoreCartRelations
    }
  )
}
