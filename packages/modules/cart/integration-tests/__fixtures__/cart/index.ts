import { CreateCartDTO, InferEntityType } from "@zjedene-medusa/framework/types"
import { SqlEntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { Cart } from "../../../src/models"
import { defaultCartsData } from "./data"
import { toMikroORMEntity } from "@zjedene-medusa/framework/utils"

export * from "./data"

export async function createCarts(
  manager: SqlEntityManager,
  cartsData: CreateCartDTO[] = defaultCartsData
): Promise<InferEntityType<typeof Cart>[]> {
  const carts: InferEntityType<typeof Cart>[] = []

  for (let cartData of cartsData) {
    let cart = manager.create(toMikroORMEntity(Cart), cartData)

    await manager.persistAndFlush(cart)
  }

  return carts
}
