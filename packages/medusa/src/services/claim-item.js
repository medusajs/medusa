import _ from "lodash"
import { Validator, MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets } from "typeorm"

class ClaimItemService extends BaseService {
  static Events = {
    CREATED: "claim_item.created",
    UPDATED: "claim_item.updated",
    CANCELED: "claim_item.canceled",
  }

  constructor({
    manager,
    claimItemRepository,
    claimTagRepository,
    claimImageRepository,
    lineItemService,
    eventBusService,
  }) {
    super()

    /** @private @constant {EntityManager} */
    this.manager_ = manager

    /** @private @constant {ClaimRepository} */
    this.claimItemRepository_ = claimItemRepository
    this.claimTagRepository_ = claimTagRepository
    this.claimImageRepository_ = claimImageRepository

    /** @private @constant {LineItemService} */
    this.lineItemService_ = lineItemService

    /** @private @constant {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new ClaimItemService({
      manager,
      claimItemRepository: this.claimItemRepository_,
      claimTagRepository: this.claimTagRepository_,
      claimImageRepository: this.claimImageRepository_,
      lineItemService: this.lineItemService_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = manager

    return cloned
  }

  create(data) {
    return this.atomicPhase_(async manager => {
      const ciRepo = manager.getCustomRepository(this.claimItemRepository_)

      const { item_id, reason, quantity, tags, images, ...rest } = data

      if (
        reason !== "missing_item" &&
        reason !== "wrong_item" &&
        reason !== "production_failure" &&
        reason !== "other"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Claim Item reason must be one of "missing_item", "wrong_item", "production_failure" or "other".`
        )
      }

      const lineItem = await this.lineItemService_
        .withTransaction(manager)
        .retrieve(item_id)

      if (lineItem.fulfilled_quantity < quantity) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot claim more of an item than has been fulfilled."
        )
      }

      const claimTagRepo = manager.getCustomRepository(this.claimTagRepository_)
      const tagsToAdd = await Promise.all(
        tags.map(async t => {
          const normalized = t.trim().toLowerCase()
          const existing = await claimTagRepo.findOne({
            where: { value: normalized },
          })
          if (existing) {
            return existing
          }

          return claimTagRepo.create({ value: normalized })
        })
      )

      const claimImgRepo = manager.getCustomRepository(
        this.claimImageRepository_
      )
      const imagesToAdd = images.map(url => {
        return claimImgRepo.create({ url })
      })

      const created = ciRepo.create({
        ...rest,
        variant_id: lineItem.variant_id,
        tags: tagsToAdd,
        images: imagesToAdd,
        item_id,
        reason,
        quantity,
      })

      const result = await ciRepo.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimItemService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  update(id, data) {
    return this.atomicPhase_(async manager => {
      const ciRepo = manager.getCustomRepository(this.claimItemRepository_)
      const item = await this.retrieve(id, { relations: ["images", "tags"] })

      const { tags, images, reason, note, metadata } = data

      if (note) {
        item.note = note
      }

      if (reason) {
        item.reason = reason
      }

      if (metadata) {
        item.metadata = this.setMetadata_(item, update.metadata)
      }

      if (tags) {
        item.tags = []
        const claimTagRepo = manager.getCustomRepository(
          this.claimTagRepository_
        )
        for (const t of tags) {
          if (t.id) {
            item.tags.push(t)
          } else {
            const normalized = t.value.trim().toLowerCase()

            const existing = await claimTagRepo.findOne({
              where: { value: normalized },
            })

            if (existing) {
              item.tags.push(existing)
            } else {
              item.tags.push(claimTagRepo.create({ value: normalized }))
            }
          }
        }
      }

      if (images) {
        const claimImgRepo = manager.getCustomRepository(
          this.claimImageRepository_
        )
        const ids = images.map(i => i.id)
        for (const i of item.images) {
          if (!ids.includes(i.id)) {
            await claimImgRepo.remove(i)
          }
        }

        item.images = []

        for (const i of images) {
          if (i.id) {
            item.images.push(i)
          } else {
            item.images.push(claimImgRepo.create({ url: i.url }))
          }
        }
      }

      await ciRepo.save(item)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimItemService.Events.UPDATED, {
          id: item.id,
        })

      return item
    })
  }

  async cancel(id) {}

  /**
   * @param {Object} selector - the query object for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector,
    config = { skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const ciRepo = this.manager_.getCustomRepository(this.claimItemRepository_)
    const query = this.buildQuery_(selector, config)
    return ciRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param {string} orderId - id of order to retrieve
   * @return {Promise<Order>} the order document
   */
  async retrieve(id, config = {}) {
    const claimItemRepo = this.manager_.getCustomRepository(
      this.claimItemRepository_
    )
    const validatedId = this.validateId_(id)

    const query = this.buildQuery_({ id: validatedId }, config)
    const item = await claimItemRepo.findOne(query)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Claim item with id: ${id} was not found.`
      )
    }

    return item
  }

  /**
   * Dedicated method to delete metadata for an order.
   * @param {string} orderId - the order to delete metadata from.
   * @param {string} key - key for metadata field
   * @return {Promise} resolves to the updated result.
   */
  async deleteMetadata(orderId, key) {
    const validatedId = this.validateId_(orderId)

    if (typeof key !== "string") {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Key type is invalid. Metadata keys must be strings"
      )
    }

    const keyPath = `metadata.${key}`
    return this.orderModel_
      .updateOne({ _id: validatedId }, { $unset: { [keyPath]: "" } })
      .catch(err => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }
}

export default ClaimItemService
