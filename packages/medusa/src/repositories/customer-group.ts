import { EntityRepository, Repository, getConnection, In } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { CustomerGroup } from "../models/customer-group"
import { Customer } from ".."

@EntityRepository(CustomerGroup)
export class CustomerGroupRepository extends Repository<CustomerGroup> {
  async addCustomerBatch(
    groupId: string,
    customerIds: string[]
  ): Promise<CustomerGroup> {
    const customerGroup = await this.findOne(groupId)

    try {
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
    } catch (error) {
      if (error.code === "23503") {
        if (!customerGroup) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `CustomerGroup with id ${groupId} was not found`
          )
        }

        const existingCustomers = await getConnection()
          .getRepository(Customer)
          .createQueryBuilder("customer")
          .where({ id: In(customerIds) })
          .getMany()

        const nonExistingCustomers = customerIds.filter(
          (cId) => existingCustomers.findIndex((el) => el.id === cId) === -1
        )

        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `The following customer ids do not exist: ${JSON.stringify(
            nonExistingCustomers.join(", ")
          )}`
        )
      }
      throw error
    }
  }
}
