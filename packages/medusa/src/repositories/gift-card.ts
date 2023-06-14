import { FindOptionsWhere, ILike, Raw } from "typeorm"
import { GiftCard } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export const GiftCardRepository = dataSource.getRepository(GiftCard).extend({
  async listGiftCardsAndCount(
    query: ExtendedFindConfig<GiftCard>,
    q?: string
  ): Promise<[GiftCard[], number]> {
    const query_ = { ...query }
    query_.where = query_.where as FindOptionsWhere<GiftCard>

    if (q) {
      delete query_.where.id

      query_.relations = query_.relations ?? {}
      query_.relations.order = query_.relations.order ?? true

      query_.where = query_.where as FindOptionsWhere<GiftCard>[]
      query_.where = [
        {
          ...query_.where,
          code: ILike(`%${q}%`),
        },
        {
          ...query_.where,
          order: {
            display_id: Raw((alias) => `CAST(${alias} as varchar) ILike :q`, {
              q: `%${q}%`,
            }),
          },
        },
      ]
    }

    return await this.findAndCount(query_)
  },
})
export default GiftCardRepository
