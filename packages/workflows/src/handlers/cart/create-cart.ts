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
  const cartServiceTx = cartService.withTransaction(manager)
  
  return await cartServiceTx.createOnlyCart(data)
}

createCart.aliases = Aliases
