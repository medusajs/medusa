import { FindOperator, FindOptionsWhere, ILike, In } from "typeorm"
import { Customer } from "../models"
import { dataSource } from "../loaders/database"
import { ExtendedFindConfig } from "../types/common"

export const CustomerRepository = dataSource.getRepository(Customer).extend({
  async listAndCount(
    query: ExtendedFindConfig<Customer> & {
      where: FindOptionsWhere<Customer & { groups?: FindOperator<string[]> }>
    },
    q: string | undefined = undefined
  ): Promise<[Customer[], number]> {
    const query_ = { ...query }

    if (query_.where.groups) {
      query_.relations = query_.relations ?? {}
      query_.relations.groups = query_.relations.groups ?? true

      query.where.groups = {
        id: In((query_.where.groups as FindOperator<string[]>).value),
      }
    }

    if (q) {
      query_.where = query_.where as FindOptionsWhere<Customer>
      delete query_.where.email
      delete query_.where.first_name
      delete query_.where.last_name

      query_.where = [
        {
          ...query_.where,
          email: ILike(`%${q}%`),
        },
        {
          ...query_.where,
          first_name: ILike(`%${q}%`),
        },
        {
          ...query_.where,
          last_name: ILike(`%${q}%`),
        },
      ]
    }

    return await this.findAndCount(query_)
  },
})
export default CustomerRepository
