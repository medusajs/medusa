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
  data,
}: WorkflowArguments): Promise<HandlerOutputData> {
  const cartService = container.resolve("cartService")
  
  return await cartService.createOnlyCart(data)
}

createCart.aliases = Aliases
