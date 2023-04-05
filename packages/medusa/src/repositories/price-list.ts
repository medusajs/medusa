import { FindOperator, FindOptionsWhere, ILike, In } from "typeorm"
import { PriceList } from "../models"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export const PriceListRepository = dataSource.getRepository(PriceList).extend({
  async listAndCount(
    query: ExtendedFindConfig<PriceList>,
    q?: string
  ): Promise<[PriceList[], number]> {
    const query_ = { ...query }
    query_.relationLoadStrategy = "query"
    query_.where = query.where as FindOptionsWhere<PriceList>

    const groups = query_.where.customer_groups as unknown as FindOperator<
      string[]
    >
    delete query_.where.customer_groups

    if (groups) {
      query_.relations = query.relations ?? {}
      query_.relations.customer_groups =
        query_.relations.customer_groups ?? true

      query_.where.customer_groups = {
        ...(query_.where.customer_groups ?? {}),
        id: In(groups.value),
      }
    }

    if (q) {
      if (!groups) {
        query.relations = query.relations ?? {}
        query.relations.customer_groups =
          query.relations.customer_groups ?? true
      }

      query_.where = [
        {
          ...query_.where,
          name: ILike(`%${q}%`),
        },
        {
          ...query_.where,
          description: ILike(`%${q}%`),
        },
        {
          ...query_.where,
          customer_groups: {
            ...query_.where.customer_groups,
            name: ILike(`%${q}%`),
          },
        },
      ]
    }

    return await this.findAndCount(query_)
  },
})

export default PriceListRepository
