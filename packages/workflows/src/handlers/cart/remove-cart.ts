import { WorkflowArguments } from "../../helper"

enum Aliases {
  Cart = "cart",
}

type HandlerInputData = {
  cart: {
    id: string
  }
}

export async function removeCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)
  const cart = data[Aliases.Cart]

  await cartServiceTx.delete(cart.id)
}

removeCart.aliases = Aliases
