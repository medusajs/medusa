import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ReturnReason } from "../models"
import { ReturnReasonRepository } from "../repositories/return-reason"
import { FindConfig, Selector } from "../types/common"
import { CreateReturnReason, UpdateReturnReason } from "../types/return-reason"
import { buildQuery } from "../utils"

type InjectedDependencies = {
  manager: EntityManager
  returnReasonRepository: typeof ReturnReasonRepository
}

class ReturnReasonService extends TransactionBaseService {
  protected readonly retReasonRepo_: typeof ReturnReasonRepository

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({ manager, returnReasonRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.retReasonRepo_ = returnReasonRepository
  }

  async create(data: CreateReturnReason): Promise<ReturnReason | never> {
    return await this.atomicPhase_(async (manager) => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)

      if (data.parent_return_reason_id && data.parent_return_reason_id !== "") {
        const parentReason = await this.retrieve(data.parent_return_reason_id)

        if (parentReason.parent_return_reason_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Doubly nested return reasons is not supported"
          )
        }
      }

      const created = rrRepo.create(data)

      return await rrRepo.save(created)
    })
  }

  async update(id: string, data: UpdateReturnReason): Promise<ReturnReason> {
    return await this.atomicPhase_(async (manager) => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)
      const reason = await this.retrieve(id)

      for (const key of Object.keys(data).filter(
        (k) => typeof data[k] !== `undefined`
      )) {
        reason[key] = data[key]
      }

      await rrRepo.save(reason)

      return reason
    })
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - config object
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: Selector<ReturnReason>,
    config: FindConfig<ReturnReason> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<ReturnReason[]> {
    const rrRepo = this.manager_.getCustomRepository(this.retReasonRepo_)
    const query = buildQuery(selector, config)
    return rrRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param {string} returnReasonId - id of order to retrieve
   * @param {Object} config - config object
   * @return {Promise<Order>} the order document
   */
  async retrieve(
    returnReasonId: string,
    config: FindConfig<ReturnReason> = {}
  ): Promise<ReturnReason | never> {
    if (!isDefined(returnReasonId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"returnReasonId" must be defined`
      )
    }

    const rrRepo = this.manager_.getCustomRepository(this.retReasonRepo_)

    const query = buildQuery({ id: returnReasonId }, config)
    const item = await rrRepo.findOne(query)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Return Reason with id: ${returnReasonId} was not found.`
      )
    }

    return item
  }

  async delete(returnReasonId: string): Promise<void> {
    return this.atomicPhase_(async (manager) => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)

      // We include the relation 'return_reason_children' to enable cascading deletes of return reasons if a parent is removed
      const reason = await this.retrieve(returnReasonId, {
        relations: ["return_reason_children"],
      })

      if (!reason) {
        return Promise.resolve()
      }

      await rrRepo.softRemove(reason)

      return Promise.resolve()
    })
  }
}

export default ReturnReasonService
