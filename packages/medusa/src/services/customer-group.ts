import { MedusaError } from "medusa-core-utils"
import { BaseService } from "../interfaces"
import { DeepPartial, EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import { CustomerService } from "."
import { CustomerGroup } from ".."
import { CustomerGroupRepository } from "../repositories/customer-group"
import { FindConfig } from "../types/common"
import {
  CustomerGroupUpdate,
  FilterableCustomerGroupProps,
} from "../types/customer-groups"
import { formatException } from "../utils/exception-formatter"
import { AdminPostCustomerGroupsGroupReq } from "../api/routes/admin/customer-groups"

type CustomerGroupConstructorProps = {
  manager: EntityManager
  customerGroupRepository: typeof CustomerGroupRepository
  customerService: CustomerService
}

/**
 * Provides layer to manipulate discounts.
 * @implements {BaseService}
 */
class CustomerGroupService extends BaseService<CustomerGroupService> {
  protected readonly manager_: EntityManager
  protected readonly customerGroupRepository_: typeof CustomerGroupRepository
  protected readonly customerService_: CustomerService

  constructor({
    manager,
    customerGroupRepository,
    customerService,
  }: CustomerGroupConstructorProps) {
    super({
      manager,
      customerGroupRepository,
      customerService,
    })

    this.manager_ = manager
    this.customerGroupRepository_ = customerGroupRepository
    this.customerService_ = customerService
  }

  async retrieve(id: string, config = {}): Promise<CustomerGroup> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo = transactionManager.getCustomRepository(
          this.customerGroupRepository_
        )

        const validatedId = this.validateId_(id)
        const query = this.buildQuery_({ id: validatedId }, config)

        const customerGroup = await cgRepo.findOne(query)
        if (!customerGroup) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `CustomerGroup with id ${id} was not found`
          )
        }

        return customerGroup
      }
    )
  }

  /**
   * Creates a customer group with the provided data.
   * @param {DeepPartial<CustomerGroup>} group - the customer group to create
   * @return {Promise} the result of the create operation
   */
  async create(group: DeepPartial<CustomerGroup>): Promise<CustomerGroup> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        try {
          const cgRepo: CustomerGroupRepository =
            transactionManager.getCustomRepository(
              this.customerGroupRepository_
            )

          const created = cgRepo.create(group)
          return await cgRepo.save(created)
        } catch (err) {
          if (err.code === "23505") {
            throw new MedusaError(MedusaError.Types.DUPLICATE_ERROR, err.detail)
          }
          throw err
        }
      }
    )
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

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)
        return await cgRepo.addCustomers(id, ids)
      },
      async (error: { code?: string }) => {
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
   * Update a customer group.
   *
   * @param {string} customerGroupId - id of the customer group
   * @param {CustomerGroupUpdate} update - customer group partial data
   * @returns resulting customer group
   */
  async update(
    customerGroupId: string,
    update: CustomerGroupUpdate | AdminPostCustomerGroupsGroupReq
  ): Promise<CustomerGroup> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const { metadata, ...properties } = update

        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)

        const customerGroup = await this.retrieve(customerGroupId)

        for (const key in properties) {
          if (typeof properties[key] !== "undefined") {
            customerGroup[key] = properties[key]
          }
        }

        if (typeof metadata !== "undefined") {
          customerGroup.metadata = this.setMetadata_(customerGroup, metadata)
        }
        return await cgRepo.save(customerGroup)
      }
    )
  }

  /**
   * Remove customer group
   *
   * @param {string} groupId id of the customer group to delete
   * @return {Promise} a promise
   */
  async delete(groupId: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)

        const customerGroup = await cgRepo.findOne({ where: { id: groupId } })

        if (customerGroup) {
          await cgRepo.remove(customerGroup)
        }
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
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)

        const query = this.buildQuery_(selector, config)
        return await cgRepo.find(query)
      }
    )
  }

  /**
   * Retrieve a list of customer groups and total count of records that match the query.
   *
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableCustomerGroupProps = {},
    config: FindConfig<CustomerGroup>
  ): Promise<[CustomerGroup[], number]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)

        let q
        if ("q" in selector) {
          q = selector.q
          delete selector.q
        }

        const query = this.buildQuery_(selector, config)

        if (q) {
          const where = query.where
          where.name = undefined

          query.where = ((qb: SelectQueryBuilder<CustomerGroup>): void => {
            qb.where(where).andWhere([{ name: ILike(`%${q}%`) }])
          }) as any
        }
        return await cgRepo.findAndCount(query)
      }
    )
  }

  /**
   * Remove list of customers from a customergroup
   *
   * @param {string} id id of the customer group from which the customers are removed
   * @param {string[] | string} customerIds id's of the customer to remove from group
   * @return {Promise<CustomerGroup>} the customergroup with the provided id
   */
  async removeCustomer(
    id: string,
    customerIds: string[] | string
  ): Promise<CustomerGroup> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cgRepo: CustomerGroupRepository =
          transactionManager.getCustomRepository(this.customerGroupRepository_)
        let ids: string[]
        if (typeof customerIds === "string") {
          ids = [customerIds]
        } else {
          ids = customerIds
        }

        const customerGroup = await this.retrieve(id)

        await cgRepo.removeCustomers(id, ids)

        return customerGroup
      }
    )
  }
}

export default CustomerGroupService
