import { MedusaError } from "medusa-core-utils"
import { EntityRepository, In, Repository } from "typeorm"
import { CustomerGroup } from "../models/customer-group"
import { CustomerBatchIds } from "../types/customer-groups"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async deleteCustomerBatch(
    groupId: string,
    customerIds: CustomerBatchIds[]
  ): Promise<CustomerGroup | undefined> {
    const customerGroup = await this.findOne(groupId)
    if (!customerGroup) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `CustomerGroup with id ${groupId} was not found`
      )
    }

    await this.createQueryBuilder()
      .delete()
      .from("customer_group_customers")
      .where({
        customer_group_id: groupId,
        customer_id: In(customerIds.map(({ id }) => id)),
      })
      .execute()

    return customerGroup
  }
}
