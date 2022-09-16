import { ILike, Raw } from "typeorm"
import { GiftCard } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export const GiftCardRepository = dataSource.getRepository(GiftCard).extend({
  async listGiftCardsAndCount(
    query: ExtendedFindConfig<GiftCard>,
    q?: string
  ): Promise<[GiftCard[], number]> {
    let query_ = { ...query }

    if (q) {
      query_ = {
        ...query_,
        where: {
          ...query_.where,
          id: undefined,
          code: ILike(`%${q}%`),
          order: {
            display_id: Raw(
              (alias) => `CAST(${alias} as varchar) ILike '%${q}%'`
            ),
          },
        },
        relations: {
          ...query_.relations,
          order: true,
        },
      }
    }

    return await this.findAndCount(query_)
  },
})
