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

    if (groups || q) {
      query_.relations = query_.relations ?? {}
      query_.relations.customer_groups =
        query_.relations.customer_groups ?? true

      if (groups) {
        query_.where.customer_groups = {
          id: In(groups.value),
        }
      }
    }

    if (q) {
      const groupsWhere = query_.where.customer_groups ?? {}

      query_.where = query_.where ?? {}
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
            ...groupsWhere,
            name: ILike(`%${q}%`),
          },
        },
      ]
    }

    return await this.findAndCount(query_)
  },
})

export default PriceListRepository
