import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { DeepPartial, EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import { CustomerGroup, ProductVariant } from ".."
import { CustomerGroupRepository } from "../repositories/customer-group"
import { FindConfig } from "../types/common"
import { FilterableCustomerGroupProps } from "../types/customer-groups"

type CustomerGroupConstructorProps = {
  manager: EntityManager
  customerGroupRepository: typeof CustomerGroupRepository
}
class CustomerGroupService extends BaseService {
  private manager_: EntityManager

  private customerGroupRepository_: typeof CustomerGroupRepository

  constructor({
    manager,
    customerGroupRepository,
  }: CustomerGroupConstructorProps) {
    super()

    this.manager_ = manager

    this.customerGroupRepository_ = customerGroupRepository
  }

  withTransaction(transactionManager: EntityManager): CustomerGroupService {
    if (!transactionManager) {
      return this
    }

    const cloned = new CustomerGroupService({
      manager: transactionManager,
      customerGroupRepository: this.customerGroupRepository_,
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
        `CustomerGroup with ${id} was not found`
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
    const cgRepo: CustomerGroupRepository = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.name

      query.where = (qb: SelectQueryBuilder<CustomerGroup>): void => {
        qb.where(where).andWhere([{ name: ILike(`%${q}%`) }])
      }
    }
    return await cgRepo.findAndCount(query)
  }
}

export default CustomerGroupService
