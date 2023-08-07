import { WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

type HandlerInputData = {
  cart: {
    id: string
  }
  config: {
    retrieveConfig: {
      select: string[]
      relations: string[]
    }
  }
}

enum Aliases {
  Cart = "cart",
  Config = "config",
}

export async function retrieveCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)
  const cart = data[Aliases.Cart]
  const config = data[Aliases.Config].retrieveConfig

  const retrieved = await cartServiceTx.retrieve(cart.id, {
    relations: config.relations,
    select: config.select,
  })

  return retrieved
}

retrieveCart.aliases = Aliases
