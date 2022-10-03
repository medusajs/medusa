import { ILike, In } from "typeorm"
import { Customer } from "../models"
import { dataSource } from "../loaders/database"
import { ExtendedFindConfig } from "../types/common"

export const CustomerRepository = dataSource.getRepository(Customer).extend({
  async listAndCount(
    query: ExtendedFindConfig<Customer>,
    q: string | undefined = undefined
  ): Promise<[Customer[], number]> {
    const query_ = { ...query }

    const groups = query_.where?.groups as { value: string[] }
    delete query_.where.groups

    if (q) {
      delete query_.where.email
      delete query_.where.first_name
      delete query_.where.last_name

      query_.where.email = ILike(`%${q}%`)
      query_.where.first_name = ILike(`%${q}%`)
      query_.where.last_name = ILike(`%${q}%`)
    }

    return await this.findAndCount({
      ...query_,
      where: {
        ...query_.where,
        groups: {
          id: In(groups.value),
        },
      },
      relationLoadStrategy: "query",
    })
  },
})
export default CustomerRepository
