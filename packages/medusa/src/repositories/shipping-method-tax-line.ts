import { EntityRepository, Repository } from "typeorm"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"

@EntityRepository(ShippingMethodTaxLine)
export class ShippingMethodTaxLineRepository extends Repository<ShippingMethodTaxLine> {
  async deleteForCart(cartId: string): Promise<void> {
    const qb = this.createQueryBuilder("line")
      .select(["line.id"])
      .innerJoin("shipping_method", "sm", "sm.id = line.shipping_method_id")
      .innerJoin(
        "cart",
        "c",
        "sm.cart_id = :cartId AND c.completed_at is NULL",
        { cartId }
      )

    const toDelete = await qb.getMany()

    await this.createQueryBuilder()
      .delete()
      .whereInIds(toDelete.map((d) => d.id))
      .execute()
  }
}
