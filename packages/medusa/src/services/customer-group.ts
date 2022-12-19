import { isDefined, MedusaError } from "medusa-core-utils"
import { DeepPartial, EntityManager, ILike } from "typeorm"
import { CustomerService } from "."
import { CustomerGroup } from ".."
import {
  CustomerGroupRepository,
  FindWithoutRelationsOptions,
} from "../repositories/customer-group"
import { FindConfig, Selector } from "../types/common"
import { CustomerGroupUpdate } from "../types/customer-groups"
import { buildQuery, isString, PostgresError, setMetadata } from "../utils"
import { TransactionBaseService } from "../interfaces"

type CustomerGroupConstructorProps = {
  manager: EntityManager
  customerGroupRepository: typeof CustomerGroupRepository
  customerService: CustomerService
}

class CustomerGroupService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly customerGroupRepository_: typeof CustomerGroupRepository
  protected readonly customerService_: CustomerService

  constructor({
    manager,
    customerGroupRepository,
    customerService,
  }: CustomerGroupConstructorProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.customerGroupRepository_ = customerGroupRepository
    this.customerService_ = customerService
  }

  async retrieve(customerGroupId: string, config = {}): Promise<CustomerGroup> {
    if (!isDefined(customerGroupId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"customerGroupId" must be defined`
      )
    }

    const cgRepo = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )

    const query = buildQuery({ id: customerGroupId }, config)

    const customerGroup = await cgRepo.findOne(query)
    if (!customerGroup) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `CustomerGroup with id ${customerGroupId} was not found`
      )
    }

    return customerGroup
  }

  /**
   * Creates a customer group with the provided data.
   * @param group - the customer group to create
   * @return the result of the create operation
   */
  async create(group: DeepPartial<CustomerGroup>): Promise<CustomerGroup> {
    return await this.atomicPhase_(async (manager) => {
      try {
        const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
          this.customerGroupRepository_
        )

        const created = cgRepo.create(group)
        return await cgRepo.save(created)
      } catch (err) {
        if (err.code === PostgresError.DUPLICATE_ERROR) {
          throw new MedusaError(MedusaError.Types.DUPLICATE_ERROR, err.detail)
        }
        throw err
      }
    })
  }

  /**
   * Add a batch of customers to a customer group at once
   * @param id id of the customer group to add customers to
   * @param customerIds customer id's to add to the group
   * @return the customer group after insertion
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
      async (manager) => {
        const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
          this.customerGroupRepository_
        )
        return await cgRepo.addCustomers(id, ids)
      },
      async (e: any) => {
        await this.handleCreationFail(id, ids, e)
      }
    )
  }

  /**
   * Update a customer group.
   *
   * @param customerGroupId - id of the customer group
   * @param update - customer group partial data
   * @returns resulting customer group
   */
  async update(
    customerGroupId: string,
    update: CustomerGroupUpdate
  ): Promise<CustomerGroup> {
    return await this.atomicPhase_(async (manager) => {
      const { metadata, ...properties } = update

      const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
        this.customerGroupRepository_
      )

      const customerGroup = await this.retrieve(customerGroupId)

      for (const key in properties) {
        if (isDefined(properties[key])) {
          customerGroup[key] = properties[key]
        }
      }

      if (isDefined(metadata)) {
        customerGroup.metadata = setMetadata(customerGroup, metadata)
      }

      return await cgRepo.save(customerGroup)
    })
  }

  /**
   * Remove customer group
   *
   * @param groupId id of the customer group to delete
   * @return a promise
   */
  async delete(groupId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const cgRepo: CustomerGroupRepository = manager.getCustomRepository(
        this.customerGroupRepository_
      )

      const customerGroup = await cgRepo.findOne({ where: { id: groupId } })

      if (customerGroup) {
        await cgRepo.remove(customerGroup)
      }

      return Promise.resolve()
    })
  }

  /**
   * List customer groups.
   *
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return  the result of the find operation
   */
  async list(
    selector: Selector<CustomerGroup> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<CustomerGroup>
  ): Promise<CustomerGroup[]> {
    const [customerGroups] = await this.listAndCount(selector, config)
    return customerGroups
  }

  /**
   * Retrieve a list of customer groups and total count of records that match the query.
   *
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<CustomerGroup> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<CustomerGroup>
  ): Promise<[CustomerGroup[], number]> {
    const cgRepo: CustomerGroupRepository = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      query.where.name = ILike(`%${q}%`)
    }

    if (query.where.discount_condition_id) {
      const { relations, ...query_ } = query
      return await cgRepo.findWithRelationsAndCount(
        relations,
        query_ as FindWithoutRelationsOptions
      )
    }

    return await cgRepo.findAndCount(query)
  }

  /**
   * Remove list of customers from a customergroup
   *
   * @param id id of the customer group from which the customers are removed
   * @param customerIds id's of the customer to remove from group
   * @return the customergroup with the provided id
   */
  async removeCustomer(
    id: string,
    customerIds: string[] | string
  ): Promise<CustomerGroup> {
    const cgRepo: CustomerGroupRepository = this.manager_.getCustomRepository(
      this.customerGroupRepository_
    )
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

  private async handleCreationFail(
    id: string,
    ids: string[],
    error: any
  ): Promise<never> {
    if (error.code === PostgresError.FOREIGN_KEY_ERROR) {
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
    throw error
  }
}

export default CustomerGroupService
