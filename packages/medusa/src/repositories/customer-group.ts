import {
  EntityRepository,
  Repository,
  getManager,
  getConnection,
} from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { CustomerGroup } from "../models/customer-group"
import { CustomerGroupsBatchCustomer } from "../types/customer-groups"
import { Customer } from ".."

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async addCustomerBatch(
    groupId: string,
    customerIds: CustomerGroupsBatchCustomer[]
  ): Promise<CustomerGroup> {
    try {
      const customerGroup = await this.findOne(groupId)
      if (!customerGroup) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `CustomerGroup with id ${groupId} was not found`
        )
      }

      await this.createQueryBuilder()
        .insert()
        .into("customer_group_customers")
        .values(
          customerIds.map(({ id }) => ({
            customer_id: id,
            customer_group_id: groupId,
          }))
        )
        .orIgnore()
        .execute()

      return customerGroup
    } catch (error) {
      if (error.code === "23503") {
        const existingCustomers = await getConnection()
          .getRepository(Customer)
          .createQueryBuilder("customer")
          .where("customer.id IN (:...customer_ids)", {
            customer_ids: customerIds.map(({ id }) => id),
          })
          .getMany()

        const nonExistingCustomers = customerIds.filter(
          (cId) => existingCustomers.findIndex((el) => el.id === cId.id) === -1
        )

        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The following customer ids do not exist: ${JSON.stringify(
            nonExistingCustomers.map(({ id }) => id).join(", ")
          )}`
        )
      }
      throw error
    }
  }
}
