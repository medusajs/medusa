import { EntityRepository, Repository } from "typeorm"
import { Customer } from "../models/customer"

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async listAndCount(query, groups): Promise<[Customer[], number]> {
    let qb = this.createQueryBuilder("customer")
      .where(query.where)
      .skip(query.skip)
      .take(query.take)

    if (groups) {
      qb = qb
        .leftJoinAndSelect("customer.groups", "group")
        .andWhere(`group.id IN (:...ids)`, { ids: groups.value })
    }

    if (query.relations?.length) {
      query.relations.forEach((rel) => {
        qb = qb.leftJoinAndSelect(`customer.${rel}`, rel)
      })
    }

    return await qb.getManyAndCount()
  }
}
