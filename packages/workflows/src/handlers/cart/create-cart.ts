import { CartDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

enum Aliases {
  SalesChannel = "SalesChannel",
  Addresses = "addresses",
  Customer = "customer",
  Region = "region",
  Context = "context",
}

type HandlerOutputData = {
  cart: CartDTO
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<HandlerOutputData> {
  const { manager } = context
  const cartService = container.resolve("cartService")

  return await cartService.withTransaction(manager).createCartFromData(data)
}

createCart.aliases = Aliases
