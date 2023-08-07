import { WorkflowArguments } from "../../helper"

enum Aliases {
  CreatedCart = "createdCart",
}

type HandlerInputData = {
  createdCart: {
    cart: {
      id: string
    }
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
  const cart = data[Aliases.CreatedCart].cart

  await cartServiceTx.delete(cart.id)
}

removeCart.aliases = Aliases
