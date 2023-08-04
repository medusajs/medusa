import { WorkflowArguments } from "../../helper"

enum Aliases {
  CreatedCart = "createdCart",
}

type HandlerInputData = {
  createdCart: {
    id?: string
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

  await cartServiceTx.delete(data[Aliases.CreatedCart].id)
}

removeCart.aliases = Aliases
