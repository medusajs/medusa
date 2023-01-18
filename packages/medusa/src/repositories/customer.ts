import { FindOptionsWhere, ILike } from "typeorm"
import { Customer } from "../models"
import { dataSource } from "../loaders/database"
import { ExtendedFindConfig } from "../types/common"

export const CustomerRepository = dataSource.getRepository(Customer).extend({
  async listAndCount(
    query: ExtendedFindConfig<Customer>,
    q: string | undefined = undefined
  ): Promise<[Customer[], number]> {
    const query_ = { ...query }

    if (q) {
      query_.where = query_.where as FindOptionsWhere<Customer>
      delete query_.where.email
      delete query_.where.first_name
      delete query_.where.last_name

      query.where = [
        {
          ...query.where,
          email: ILike(`%${q}%`),
        },
        {
          ...query.where,
          first_name: ILike(`%${q}%`),
        },
        {
          ...query.where,
          last_name: ILike(`%${q}%`),
        },
      ]
    }

    query_.relationLoadStrategy = "query"
    return await this.findAndCount(query_)
  },
})
export default CustomerRepository
