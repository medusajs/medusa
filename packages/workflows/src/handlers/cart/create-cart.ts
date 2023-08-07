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
    config?: Record<any, any>
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

type HandlerOutputData = {
  cart: CartDTO
  config: Record<any, any>
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<HandlerOutputData> {
  const cartService = container.resolve("cartService")
  const entityManager = container.resolve("manager")
  const cartServiceTx = cartService.withTransaction(entityManager)
  const config = data[Aliases.Cart].config || {}

  delete data[Aliases.Cart].config

  const cart = await cartServiceTx.create({
    ...data[Aliases.Cart],
    ...data[Aliases.CartAddresses],
    ...data[Aliases.CartCustomer],
    ...data[Aliases.CartRegion],
    ...data[Aliases.CartContext],
  })

  return {
    cart,
    config,
  }
}

createCart.aliases = Aliases
