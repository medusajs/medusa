import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { DeepPartial, EntityManager } from "typeorm"
import { CustomerService } from "."
import { CustomerGroup } from ".."
import { CustomerGroupRepository } from "../repositories/customer-group"
import { FindConfig } from "../types/common"
import { FilterableCustomerGroupProps } from "../types/customer-groups"
import { formatException } from "../utils/exception-formatter"

type CustomerGroupConstructorProps = {
  manager: EntityManager
  customerGroupRepository: typeof CustomerGroupRepository
  customerService: CustomerService
}

/**
 * Provides layer to manipulate discounts.
 * @implements {BaseService}
 */
class CustomerGroupService extends BaseService {
  private manager_: EntityManager

  private customerGroupRepository_: typeof CustomerGroupRepository

  private customerService_: CustomerService

  constructor({
    manager,
    customerGroupRepository,
    customerService,
  }: CustomerGroupConstructorProps) {
    super()

    this.manager_ = manager

    this.customerGroupRepository_ = customerGroupRepository

    /** @private @const {CustomerGroupService} */
    this.customerService_ = customerService
  }

  withTransaction(transactionManager: EntityManager): CustomerGroupService {
    if (!transactionManager) {
      return this
    }

    const cloned = new CustomerGroupService({
      manager: transactionManager,
      customerGroupRepository: this.customerGroupRepository_,
      customerService: this.customerService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  async retrieve(id: string, config = {}): Promise<CustomerGroup> {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )

    const validatedId = this.validateId_(id)
    const query = this.buildQuery_({ id: validatedId }, config)

    const customerGroup = await customerRepo.findOne(query)
    if (!customerGroup) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `CustomerGroup with id ${id} was not found`
      )
    }

    return customerGroup
  }

  /**
   * Creates a customer group with the provided data.
   * @param {DeepPartial<CustomerGroup>} group - the customer group to create
   * @return {Promise} the result of the create operation
   */
  async create(group: DeepPartial<CustomerGroup>): Promise<CustomerGroup> {
    return this.atomicPhase_(async (manager) => {
      try {
        const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
          this.customerGroupRepository_
        )

        const created = cgRepo.create(group)

        const result = await cgRepo.save(created)

        return result
      } catch (err) {
        if (err.code === "23505") {
          throw new MedusaError(MedusaError.Types.DUPLICATE_ERROR, err.detail)
        }
        throw err
      }
    })
  }

  /**
   * Add a batch of customers to a customer group at once
   * @param {string} id id of the customer group to add customers to
   * @param {string[]} customerIds customer id's to add to the group
   * @return {Promise<CustomerGroup>} the customer group after insertion
   */
  async addCustomers(
    id: string,
    customerIds: string | string[]
  ): Promise<CustomerGroup> {
    let ids: string[]
    if (typeof customerIds === "string") {
      ids = [customerIds]
    } else {
      ids = customerIds
    }

    return this.atomicPhase_(
      async (manager) => {
        const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
          this.customerGroupRepository_
        )
        return await cgRepo.addCustomerBatch(id, ids)
      },
      async (error) => {
        if (error.code === "23503") {
          await this.retrieve(id)

          const existingCustomers = await this.customerService_.list({
            id: ids,
          })

          const nonExistingCustomers = ids.filter(
            (cId) => existingCustomers.findIndex((el) => el.id === cId) === -1
          )

          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `The following customer ids do not exist: ${JSON.stringify(
              nonExistingCustomers.join(", ")
            )}`
          )
        }
        throw formatException(error)
      }
    )
  }

  /**
   * List customer groups.
   *
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: FilterableCustomerGroupProps = {},
    config: FindConfig<CustomerGroup>
  ): Promise<CustomerGroup[]> {
    const cgRepo: CustomerGroupRepository = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )

    const query = this.buildQuery_(selector, config)
    return await cgRepo.find(query)
  }
}

export default CustomerGroupService
