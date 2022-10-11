import { EntityRepository, Repository } from "typeorm"
import { ShippingMethodTaxLine } from "../models/shipping-method-tax-line"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

@EntityRepository(ShippingMethodTaxLine)
// eslint-disable-next-line max-len
export class ShippingMethodTaxLineRepository extends Repository<ShippingMethodTaxLine> {
  async upsertLines(
    lines: ShippingMethodTaxLine[]
  ): Promise<ShippingMethodTaxLine[]> {
    const insertResult = await this.createQueryBuilder()
      .insert()
      .values(lines as QueryDeepPartialEntity<ShippingMethodTaxLine>[])
      .orUpdate({
        conflict_target: ["shipping_method_id", "code"],
        overwrite: ["rate", "name", "updated_at"],
      })
      .execute()

    return insertResult.identifiers as ShippingMethodTaxLine[]
  }

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
