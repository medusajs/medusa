import { EntityRepository, Repository } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { CustomerGroup } from "../models/customer-group"
import { CustomerGroupsBatchCustomer } from "../types/customer-groups"
import { Customer } from ".."

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

    // filter out non existing customers (required since 'orIgnore' only deals with duplicate keys)
    const existingCustomers = await this.createQueryBuilder("c_group")
      .select(["customer.id"])
      .from(Customer, "customer")
      .where("customer.id IN (:...customer_ids)", {
        customer_ids: customerIds.map(({ id }) => id),
      })
      .getMany()
      .then((value) =>
        value.map(({ id }) => ({
          customer_id: id,
          customer_group_id: groupId,
        }))
      )

    await this.createQueryBuilder()
      .insert()
      .into("customer_group_customers")
      .values(existingCustomers)
      .orIgnore()
      .execute()

    return customerGroup
  }
}
