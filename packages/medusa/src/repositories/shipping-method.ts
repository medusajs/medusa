import { EntityRepository, Repository, UpdateResult } from "typeorm"
import { ShippingMethod } from "../models/shipping-method"

@EntityRepository(ShippingMethod)
export class ShippingMethodRepository extends Repository<ShippingMethod> {
  async setFreeShippingForMethods(
    shipping_methods: ShippingMethod[]
  ): Promise<UpdateResult> {
    return this.createQueryBuilder("shipping_method")
      .update("shipping_method")
      .set({ price: 0 })
      .where("shipping_method.id IN (:...ids)", {
        ids: shipping_methods.map((sm) => sm.id),
      })
      .execute()
  }
}
