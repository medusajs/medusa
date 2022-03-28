import { EntityRepository, Repository } from "typeorm"
import { LineItemTaxLine } from "../models/line-item-tax-line"

@EntityRepository(LineItemTaxLine)
export class LineItemTaxLineRepository extends Repository<LineItemTaxLine> {
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
