import { WorkflowArguments } from "../../helper"
import { CartDTO } from "../../types"

enum Aliases {
  Cart = "cart",
  CartAddresses = "cartAddresses",
  CartCustomer = "cartCustomer",
  CartRegion = "cartRegion",
  CartContext = "cartContext"
}

export async function createCart({
  container,
  context,
  data,
}: WorkflowArguments): Promise<CartDTO> {
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