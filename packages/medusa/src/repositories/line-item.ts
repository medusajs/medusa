import { LineItem } from "../models/line-item"
import { ReturnItem } from "../models/return-item"
import { dataSource } from "../loaders/database"

export const LineItemRepository = dataSource.getRepository(LineItem).extend({
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
      .leftJoinAndSelect(`li.adjustments`, "adjustments")
      .leftJoinAndMapOne(
        `li.return_item`,
        ReturnItem,
        `ri`,
        `ri.item_id = li.id`
      )
      .where(`ri.return_id = :returnId`, { returnId })

    return (await qb.getMany()) as (LineItem & { return_item: ReturnItem })[]
  },
})

export default LineItemRepository
