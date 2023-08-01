import { WorkflowArguments } from "../../../helper"

export async function listCustomShippingOptionsForCart({
  container,
  context,
  data,
}: WorkflowArguments & {
  data: { cart_id: string }
}) {
  const customShippingOptionService = container.resolve(
    "customShippingOptionService"
  )

  const options = await customShippingOptionService
    .withTransaction(context.transactionManager)
    .list({ cart_id: data.cart_id })

  return {
    customShippingOptions: options,
  }
}
