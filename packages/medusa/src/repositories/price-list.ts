import { FindOptionsWhere, ILike } from "typeorm"
import { PriceList } from "../models"
import { CustomFindOptions, ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"

export type PriceListFindOptions = CustomFindOptions<
  PriceList,
  "status" | "type"
>

export const PriceListRepository = dataSource.getRepository(PriceList).extend({
  async listAndCount(
    query: ExtendedFindConfig<PriceList>,
    q?: string
  ): Promise<[PriceList[], number]> {
    const query_ = { ...query }

    if (q) {
      query_.where = query_.where as FindOptionsWhere<PriceList>
      delete query_.where.description
      delete query_.where.name

      query_.where.description = ILike(`%${q}%`)
      query_.where.name = ILike(`%${q}%`)
      query_.where.customer_groups = {
        name: ILike(`%${q}%`),
      }
    }

    return await this.findAndCount({
      ...query_,
      relations: {
        customer_groups: true,
      },
      relationLoadStrategy: "query",
    })
  },
})

export default PriceListRepository
