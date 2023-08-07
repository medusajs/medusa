import { WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

enum Aliases {
  Addresses = "addresses",
  Customer = "customer",
  Region = "region",
  Context = "context",
}

type HandlerInputData = {
  addresses: {
    shipping_address_id: string
    billing_address_id: string
  }
  customer: {
    customer_id?: string
    email?: string
  }
  region: {
    region_id: string
  }
  context: {
    context: Record<any, any>
  }
}

type HandlerOutputData = {
  cart: CartDTO
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<HandlerOutputData> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  const cart = await cartServiceTx.create({
    ...data[Aliases.Addresses],
    ...data[Aliases.Customer],
    ...data[Aliases.Region],
    ...data[Aliases.Context],
  })

  return cart
}

createCart.aliases = Aliases
