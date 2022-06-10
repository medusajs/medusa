import { EntityRepository, Repository } from "typeorm"
import { LineItemTaxLine } from "../models/line-item-tax-line"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

@EntityRepository(LineItemTaxLine)
export class LineItemTaxLineRepository extends Repository<LineItemTaxLine> {
  async upsertLines(lines: LineItemTaxLine[]): Promise<LineItemTaxLine[]> {
    const insertResult = await this.createQueryBuilder()
      .insert()
      .values(lines as QueryDeepPartialEntity<LineItemTaxLine>[])
      .orUpdate({
        conflict_target: ["item_id", "code"],
        overwrite: ["rate", "name", "updated_at"],
      })
      .execute()

    return insertResult.identifiers as LineItemTaxLine[]
  }

  async deleteForCart(cartId: string): Promise<void> {
    const qb = this.createQueryBuilder("line")
      .select(["line.id"])
      .innerJoin("line_item", "i", "i.id = line.item_id")
      .innerJoin(
        "cart",
        "c",
        "i.cart_id = :cartId AND c.completed_at is NULL",
        { cartId }
      )

    const toDelete = await qb.getMany()

    await this.createQueryBuilder()
      .delete()
      .whereInIds(toDelete.map((d) => d.id))
      .execute()
  }
}
