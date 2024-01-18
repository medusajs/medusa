import { DALUtils } from "@medusajs/utils"
import { Cart } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "@types"

export class CartRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Cart,
  {
    create: CreateCartDTO
    update: UpdateCartDTO
  }
>(Cart) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
