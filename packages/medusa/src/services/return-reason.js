import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
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
    return this.atomicPhase_(async manager => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)

      const created = rrRepo.create(data)

      const result = await rrRepo.save(created)
      return result
    })
  }

  update(id, data) {
    return this.atomicPhase_(async manager => {
      const rrRepo = manager.getCustomRepository(this.retReasonRepo_)
      const reason = await this.retrieve(id)

      if ("description" in data) {
        reason.description = data.description
      }

      if ("label" in data) {
        reason.label = data.label
      }

      await rrRepo.save(reason)

      return reason
    })
  }

  /**
   * @param {Object} selector - the query object for find
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
   * @param {string} orderId - id of order to retrieve
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
}

export default ReturnReasonService
