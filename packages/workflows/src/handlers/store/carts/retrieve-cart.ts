import { WorkflowArguments } from "../../../helper"

export async function retrieveCart({
  container,
  context,
  data,
}: WorkflowArguments<{
  input: {
    cartOrCartId: any
  }
}>) {
  const { transactionManager: manager } = context

  const { input } = data
  
  const cartId =
    typeof input.cartOrCartId === "string"
      ? input.cartOrCartId
      : input.cartOrCartId.id

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cartWithTotals = await cartService.retrieveWithTotals(cartId, {
    select: [], // defaultStoreCartFields,
    relations: [], // defaultStoreCartRelations,
  })

  return {
    cart: cartWithTotals,
  }
}
