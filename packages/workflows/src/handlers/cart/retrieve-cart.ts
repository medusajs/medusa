import { WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

type HandlerInputData = {
  cart: {
    id?: string
  }
}

enum Aliases {
  CreatedCart = "createdCart",
}

export async function retrieveCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)
  const cart = data[Aliases.CreatedCart].cart
  const config = data[Aliases.CreatedCart].config
  const relations = config.retrieveConfig?.relations || []
  const fields = config.retrieveConfig?.fields || []

  return await cartServiceTx.retrieve(cart.id, {
    relations,
    fields,
  })
}

retrieveCart.aliases = Aliases
