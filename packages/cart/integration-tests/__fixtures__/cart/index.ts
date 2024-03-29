import { CreateCartDTO } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Cart } from "../../../src/models"
import { defaultCartsData } from "./data"

export * from "./data"

export async function createCarts(
  manager: SqlEntityManager,
  cartsData: CreateCartDTO[] = defaultCartsData
): Promise<Cart[]> {
  const carts: Cart[] = []

  for (let cartData of cartsData) {
    let cart = manager.create(Cart, cartData)

    await manager.persistAndFlush(cart)
  }

  return carts
}
