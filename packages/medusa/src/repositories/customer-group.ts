import { DeleteResult, In } from "typeorm"
import { CustomerGroup } from "../models"
import { dataSource } from "../loaders/database"

export const CustomerGroupRepository = dataSource
  .getRepository(CustomerGroup)
  .extend({
    async addCustomers(
      groupId: string,
      customerIds: string[]
    ): Promise<CustomerGroup> {
      const customerGroup = await this.findOne({
        where: {
          id: groupId,
        },
      })

      const groupsToInsert = customerIds.map((id) => ({
        customer_id: id,
        customer_group_id: groupId,
      }))

      await this.createQueryBuilder()
        .insert()
        .into("customer_group_customers")
        .values(groupsToInsert)
        .orIgnore()
        .execute()

      return customerGroup as CustomerGroup
    },
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
    },
  })
export default CustomerGroupRepository
