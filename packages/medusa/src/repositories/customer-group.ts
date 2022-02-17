import { MedusaError } from "medusa-core-utils"
import { EntityRepository, Repository } from "typeorm"
import { CustomerGroup } from "../models/customer-group"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async addCustomerBatch(
    groupId,
    customerIds
  ): Promise<CustomerGroup | undefined> {
    const customerGroup = await this.findOne(groupId)
    if (!customerGroup) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `CustomerGroup with id ${groupId} was not found`
      )
    }

    const insertEntities = customerIds.map(({ id }) => ({
      customer_id: id,
      customer_group_id: groupId,
    }))

    await this.createQueryBuilder()
      .insert()
      .into("customer_group_customers")
      .values(insertEntities)
      .execute()

    return customerGroup
  }
}
