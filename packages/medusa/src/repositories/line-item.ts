import { EntityRepository, Repository } from "typeorm"
import { LineItem } from "../models/line-item"
import { ReturnItem } from "../models/return-item"

@EntityRepository(LineItem)
export class LineItemRepository extends Repository<LineItem> {
  /**
   * Finds line items that are to be returned as part of the Return represented
   * by `returnId`. The function joins the associated ReturnItem and the
   * LineItem's TaxLines.
   * @param returnId - the id of the Return to get LineItems by
   * @return the LineItems associated with the Return with its ReturnItem joined
   *   and mapped to `return_item`.
   */
  async findByReturn(
    returnId: string
  ): Promise<(LineItem & { return_item: ReturnItem })[]> {
    const qb = this.createQueryBuilder("li")
      .leftJoinAndSelect(`li.tax_lines`, "tax_lines")
      .leftJoinAndMapOne(
        `li.return_item`,
        ReturnItem,
        `ri`,
        `ri.item_id = li.id`
      )
      .where(`ri.return_id = :returnId`, { returnId })

    return (await qb.getMany()) as (LineItem & { return_item: ReturnItem })[]
  }
}
