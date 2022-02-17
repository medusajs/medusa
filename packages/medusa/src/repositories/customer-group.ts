import { omit } from "lodash"
import { MedusaError } from "medusa-core-utils"
import { EntityRepository, Repository, getManager } from "typeorm"
import { CustomerGroup } from "../models/customer-group"
import { CustomerGroupsBatchCustomer } from "../types/customer-groups"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async addCustomerBatch(
    groupId: string,
    customerIds: CustomerGroupsBatchCustomer[]
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

    await getManager()
      .createQueryBuilder()
      .insert()
      .into("customer_group_customers")
      .values(insertEntities)
      .orIgnore()
      .execute()

    return customerGroup
  }
}
