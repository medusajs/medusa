import { ShippingMethodTaxLine } from "../models"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"
import { dataSource } from "../loaders/database"

export const ShippingMethodTaxLineRepository = dataSource
  .getRepository(ShippingMethodTaxLine)
  .extend({
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
    },

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
    },
  })

export default ShippingMethodTaxLineRepository
