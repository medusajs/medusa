import { MedusaContainer } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { Cart, ShippingMethod } from "../../../../models"
import { CartService, ShippingOptionService } from "../../../../services"

export async function addShippingMethod({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    cart: Cart
    option_id: string
    data: Record<string, any>
  }
}) {
  const cartService: CartService = container
    .resolve("cartService")
    .withTransaction(manager)

  return await cartService.createShippingMethod(
    data.cart,
    data.option_id,
    data.data
  )
}

export async function removeShippingMethod({
  container,
  manager,
  data,
}: {
  container: MedusaContainer
  manager: EntityManager
  data: {
    shipping_method: ShippingMethod
  }
}) {
  const shippingOptionService: ShippingOptionService = container.resolve(
    "shippingOptionService"
  )

  return await shippingOptionService
    .withTransaction(manager)
    .deleteShippingMethods([data.shipping_method])
}
