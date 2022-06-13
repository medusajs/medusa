import { Brackets, EntityRepository, ILike, Repository } from "typeorm"
import { Customer } from "../models/customer"

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async listAndCount(
    query,
    q: string | undefined = undefined
  ): Promise<[Customer[], number]> {
    const groups = query.where.groups
    delete query.where.groups

    const qb = this.createQueryBuilder("customer")
      .skip(query.skip)
      .take(query.take)

    if (q) {
      delete query.where.email
      delete query.where.first_name
      delete query.where.last_name

      qb.where(
        new Brackets((qb) => {
          qb.where({ email: ILike(`%${q}%`) })
            .orWhere({ first_name: ILike(`%${q}%`) })
            .orWhere({ last_name: ILike(`%${q}%`) })
        })
      )
    }

    qb.andWhere(query.where)

    if (groups) {
      qb.leftJoinAndSelect("customer.groups", "group").andWhere(
        `group.id IN (:...ids)`,
        { ids: groups.value }
      )
    }

    if (query.relations?.length) {
      query.relations.forEach((rel) => {
        qb.leftJoinAndSelect(`customer.${rel}`, rel)
      })
    }

    return qb.getManyAndCount()
  }
}
