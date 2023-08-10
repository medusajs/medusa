import { WorkflowArguments } from "../../helper"

type HandlerInputData = {
  input: {
    cart: {
      id: string
    }
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
}: WorkflowArguments<HandlerInputData>) {
  const { manager } = context

  const cartService = container.resolve("cartService")

  const cartServiceTx = cartService.withTransaction(manager)

  const retrieved = await cartServiceTx.retrieveWithTotals(
    data[Aliases.Cart].id,
    data[Aliases.Config]?.retrieveConfig ?? {}
  )

  return retrieved
}

retrieveCart.aliases = Aliases
