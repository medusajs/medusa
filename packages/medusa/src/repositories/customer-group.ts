import { DeleteResult, EntityRepository, In, Repository } from "typeorm"
import { CustomerGroup } from "../models/customer-group"

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
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
