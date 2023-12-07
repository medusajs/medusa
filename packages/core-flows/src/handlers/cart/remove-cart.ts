import { WorkflowArguments } from "@medusajs/workflows-sdk"

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
  const { manager } = context
  const cartService = container.resolve("cartService")

  const cart = data[Aliases.Cart]

  await cartService.withTransaction(manager).delete(cart.id)
}

removeCart.aliases = Aliases
