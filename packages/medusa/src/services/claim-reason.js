import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class ClaimReasonService extends BaseService {
  constructor({ manager, claimReasonRepository }) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {ClaimReasonRepository} */
    this.claimReasonRepo_ = claimReasonRepository
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new ClaimReasonService({
      manager,
      claimReasonRepository: this.claimReasonRepo_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  create(data) {
    return this.atomicPhase_(async manager => {
      const crRepo = manager.getCustomRepository(this.claimReasonRepo_)

      if (data.parent_claim_reason_id && data.parent_claim_reason_id !== "") {
        const parentReason = await this.retrieve(data.parent_claim_reason_id)

        if (parentReason.parent_claim_reason_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Doubly nested claim reasons is not supported"
          )
        }
      }

      const created = crRepo.create(data)

      const result = await crRepo.save(created)
      return result
    })
  }

  update(id, data) {
    return this.atomicPhase_(async manager => {
      const crRepo = manager.getCustomRepository(this.claimReasonRepo_)
      const reason = await this.retrieve(id)

      const { description, label, parent_claim_reason_id } = data

      if (description) {
        reason.description = data.description
      }

      if (label) {
        reason.label = data.label
      }

      if (parent_claim_reason_id) {
        reason.parent_claim_reason_id = parent_claim_reason_id
      }

      await crRepo.save(reason)

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
    const crRepo = this.manager_.getCustomRepository(this.claimReasonRepo_)
    const query = this.buildQuery_(selector, config)
    return crRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param {string} orderId - id of order to retrieve
   * @return {Promise<Order>} the order document
   */
  async retrieve(id, config = {}) {
    const crRepo = this.manager_.getCustomRepository(this.claimReasonRepo_)
    const validatedId = this.validateId_(id)

    const query = this.buildQuery_({ id: validatedId }, config)
    const item = await crRepo.findOne(query)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Claim Reason with id: ${id} was not found.`
      )
    }

    return item
  }

  async delete(claimReasonId) {
    return this.atomicPhase_(async manager => {
      const crRepo = manager.getCustomRepository(this.claimReasonRepo_)

      // We include the relation 'claim_reason_children' to enable cascading deletes of claim reasons if a parent is removed
      const reason = await this.retrieve(claimReasonId, {
        relations: ["claim_reason_children"],
      })

      if (!reason) {
        return Promise.resolve()
      }

      await crRepo.softRemove(reason)

      return Promise.resolve()
    })
  }
}

export default ClaimReasonService
