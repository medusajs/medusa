import { isDefined, MedusaError } from "medusa-core-utils"
import { TransactionBaseService } from "../interfaces"
import { ClaimImage, ClaimItem, ClaimTag } from "../models"
import { ClaimImageRepository } from "../repositories/claim-image"
import { ClaimItemRepository } from "../repositories/claim-item"
import { ClaimTagRepository } from "../repositories/claim-tag"
import { CreateClaimItemInput } from "../types/claim"
import { FindConfig, Selector } from "../types/common"
import { buildQuery, setMetadata } from "../utils"
import EventBusService from "./event-bus"
import LineItemService from "./line-item"

class ClaimItemService extends TransactionBaseService {
  static Events = {
    CREATED: "claim_item.created",
    UPDATED: "claim_item.updated",
    CANCELED: "claim_item.canceled",
  }

  protected readonly lineItemService_: LineItemService
  protected readonly eventBus_: EventBusService
  protected readonly claimItemRepository_: typeof ClaimItemRepository
  protected readonly claimTagRepository_: typeof ClaimTagRepository
  protected readonly claimImageRepository_: typeof ClaimImageRepository

  constructor({
    claimItemRepository,
    claimTagRepository,
    claimImageRepository,
    lineItemService,
    eventBusService,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.claimItemRepository_ = claimItemRepository
    this.claimTagRepository_ = claimTagRepository
    this.claimImageRepository_ = claimImageRepository
    this.lineItemService_ = lineItemService
    this.eventBus_ = eventBusService
  }

  async create(data: CreateClaimItemInput): Promise<ClaimItem> {
    return await this.atomicPhase_(async (manager) => {
      const ciRepo = manager.withRepository(this.claimItemRepository_)

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

      if (!lineItem.variant_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot claim a custom line item"
        )
      }

      if (lineItem.fulfilled_quantity! < quantity) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot claim more of an item than has been fulfilled."
        )
      }

      let tagsToAdd: ClaimTag[] = []
      if (tags && tags.length) {
        const claimTagRepo = manager.withRepository(this.claimTagRepository_)
        tagsToAdd = await Promise.all(
          tags.map(async (t) => {
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
      }

      let imagesToAdd: ClaimImage[] = []
      if (images && images.length) {
        const claimImgRepo = manager.withRepository(this.claimImageRepository_)
        imagesToAdd = images.map((url) => {
          return claimImgRepo.create({ url })
        })
      }

      const toCreate: Partial<ClaimItem> = {
        ...rest,
        variant_id: lineItem.variant_id,
        tags: tagsToAdd,
        images: imagesToAdd,
        item_id,
        reason,
        quantity,
      }
      const created = ciRepo.create(toCreate)

      const result = await ciRepo.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ClaimItemService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  async update(id, data): Promise<ClaimItem> {
    return this.atomicPhase_(async (manager) => {
      const ciRepo = manager.withRepository(this.claimItemRepository_)
      const item = await this.retrieve(id, { relations: ["images", "tags"] })

      const { tags, images, reason, note, metadata } = data

      if (note) {
        item.note = note
      }

      if (reason) {
        item.reason = reason
      }

      if (metadata) {
        item.metadata = setMetadata(item, metadata)
      }

      if (tags) {
        item.tags = []
        const claimTagRepo = manager.withRepository(this.claimTagRepository_)
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
        const claimImgRepo = manager.withRepository(this.claimImageRepository_)
        const ids = images.map((i) => i.id)
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

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: Selector<ClaimItem>,
    config: FindConfig<ClaimItem> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<ClaimItem[]> {
    const ciRepo = this.activeManager_.withRepository(this.claimItemRepository_)
    const query = buildQuery(selector, config)
    return ciRepo.find(query)
  }

  /**
   * Gets a claim item by id.
   * @param {string} claimItemId - id of ClaimItem to retrieve
   * @param {Object} config - configuration for the find operation
   * @return {Promise<Order>} the ClaimItem
   */
  async retrieve(
    claimItemId: string,
    config: FindConfig<ClaimItem> = {}
  ): Promise<ClaimItem> {
    if (!isDefined(claimItemId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"claimItemId" must be defined`
      )
    }

    const claimItemRepo = this.activeManager_.withRepository(
      this.claimItemRepository_
    )
    const query = buildQuery({ id: claimItemId }, config)
    const item = await claimItemRepo.findOne(query)

    if (!item) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Claim item with id: ${claimItemId} was not found.`
      )
    }

    return item
  }
}

export default ClaimItemService
