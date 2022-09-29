import { DeleteResult, EntityRepository, In, Repository } from "typeorm"
import { CustomerGroup } from "../models/customer-group"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async addCustomers(
    groupId: string,
    customerIds: string[]
  ): Promise<CustomerGroup> {
    const customerGroup = await this.findOne(groupId)

    await this.createQueryBuilder()
      .insert()
      .into("customer_group_customers")
      .values(
        customerIds.map((id) => ({
          customer_id: id,
          customer_group_id: groupId,
        }))
      )
      .orIgnore()
      .execute()

    return customerGroup as CustomerGroup
  }

  async removeCustomers(
    groupId: string,
    customerIds: string[]
  ): Promise<DeleteResult> {
    return await this.createQueryBuilder()
      .delete()
      .from("customer_group_customers")
      .where({
        customer_group_id: groupId,
        customer_id: In(customerIds),
      })
      .execute()
  }
}
