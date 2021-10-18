import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class ReturnReasonService extends BaseService {
  constructor({ manager, returnReasonRepository }) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {ReturnReasonRepository} */
    this.retReasonRepo_ = returnReasonRepository
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new ReturnReasonService({
      manager,
      returnReasonRepository: this.retReasonRepo_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  create(data) {
    return this.atomicPhase_(async (manager) => {
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

      const result = await rrRepo.save(created)
      return result
    })
  }

  update(id, data) {
    return this.atomicPhase_(async (manager) => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)
      const reason = await this.retrieve(id)

      const { description, label, parent_return_reason_id } = data

      if (description) {
        reason.description = data.description
      }

      if (label) {
        reason.label = data.label
      }

      if (parent_return_reason_id) {
        reason.parent_return_reason_id = parent_return_reason_id
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
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const rrRepo = this.manager_.getCustomRepository(this.retReasonRepo_)
    const query = this.buildQuery_(selector, config)
    return rrRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param {string} id - id of order to retrieve
   * @param {Object} config - config object
   * @return {Promise<Order>} the order document
   */
  async retrieve(id, config = {}) {
    const rrRepo = this.manager_.getCustomRepository(this.retReasonRepo_)
    const validatedId = this.validateId_(id)

    const query = this.buildQuery_({ id: validatedId }, config)
    const item = await rrRepo.findOne(query)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Return Reason with id: ${id} was not found.`
      )
    }

    return item
  }

  async delete(returnReasonId) {
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
