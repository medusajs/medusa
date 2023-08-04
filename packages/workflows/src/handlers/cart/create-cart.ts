import { WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

enum Aliases {
  Cart = "cart",
  CartAddresses = "cartAddresses",
  CartCustomer = "cartCustomer",
  CartRegion = "cartRegion",
  CartContext = "cartContext",
}

type HandlerInputData = {
  cart: {
    metadata?: Record<any, any>
  }
  cartAddresses: {
    shipping_address_id: string
    billing_address_id: string
  }
  cartCustomer: {
    customer_id?: string
    email?: string
  }
  cartRegion: {
    region_id: string
  }
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<CartDTO> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)

  return await cartServiceTx.create({
    ...data[Aliases.Cart],
    ...data[Aliases.CartAddresses],
    ...data[Aliases.CartCustomer],
    ...data[Aliases.CartRegion],
    ...data[Aliases.CartContext],
  })
}

createCart.aliases = Aliases
