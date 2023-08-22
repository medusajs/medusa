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
  data,
}: WorkflowArguments<HandlerInputData>): Promise<void> {
  const cartService = container.resolve("cartService")

  const cart = data[Aliases.Cart]

  await cartService.delete(cart.id)
}

removeCart.aliases = Aliases
