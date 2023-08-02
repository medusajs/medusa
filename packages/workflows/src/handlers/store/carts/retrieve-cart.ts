import { WorkflowArguments } from "../../../helper"

export async function retrieveCart({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: any
}) {
  const { transactionManager: manager } = context

  const preparedData = data["preparedData"]

  const cartService = container.resolve("cartService").withTransaction(manager)

  const cart = await cartService.retrieveWithTotals(preparedData.cart.id, {
    select: [], // defaultStoreCartFields,
    relations: [], // defaultStoreCartRelations,
  })

  return {
    cart,
  }
}
