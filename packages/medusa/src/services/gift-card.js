import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import randomize from "randomatic"
import { Brackets } from "typeorm"

/**
 * Provides layer to manipulate gift cards.
 * @extends BaseService
 */
class GiftCardService extends BaseService {
  static Events = {
    CREATED: "gift_card.created",
  }

  constructor({
    manager,
    giftCardRepository,
    giftCardTransactionRepository,
    regionService,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {GiftCardRepository} */
    this.giftCardRepository_ = giftCardRepository

    /** @private @const {GiftCardRepository} */
    this.giftCardTransactionRepo_ = giftCardTransactionRepository

    /** @private @const {RegionService} */
    this.regionService_ = regionService

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new GiftCardService({
      manager: transactionManager,
      giftCardRepository: this.giftCardRepository_,
      giftCardTransactionRepository: this.giftCardTransactionRepo_,
      regionService: this.regionService_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Generates a 16 character gift card code
   * @return {string} the generated gift card code
   */
  generateCode_() {
    const code = [
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
    ].join("-")

    return code
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the configuration used to find the objects. contains relations, skip, and take.
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 10 }) {
    const giftCardRepo = this.manager_.getCustomRepository(
      this.giftCardRepository_
    )

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    const rels = query.relations
    delete query.relations

    if (q) {
      const where = query.where
      delete where.id

      const raw = await giftCardRepo
        .createQueryBuilder("gift_card")
        .leftJoinAndSelect("gift_card.order", "order")
        .select(["gift_card.id"])
        .where(where)
        .andWhere(
          new Brackets((qb) => {
            return qb
              .where(`gift_card.code ILIKE :q`, { q: `%${q}%` })
              .orWhere(`display_id::varchar(255) ILIKE :dId`, { dId: `${q}` })
          })
        )
        .getMany()

      return giftCardRepo.findWithRelations(
        rels,
        raw.map((i) => i.id)
      )
    }
    return giftCardRepo.findWithRelations(rels, query)
  }

  async createTransaction(data) {
    return this.atomicPhase_(async (manager) => {
      const gctRepo = manager.getCustomRepository(this.giftCardTransactionRepo_)
      const created = gctRepo.create(data)
      const saved = await gctRepo.save(created)
      return saved.id
    })
  }

  /**
   * Creates a gift card with provided data given that the data is validated.
   * @param {GiftCard} giftCard - the gift card data to create
   * @return {Promise<GiftCard>} the result of the create operation
   */
  async create(giftCard) {
    return this.atomicPhase_(async (manager) => {
      const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

      if (!giftCard.region_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Gift card is missing region_id`
        )
      }

      // Will throw if region does not exist
      const region = await this.regionService_.retrieve(giftCard.region_id)

      const code = this.generateCode_()

      const toCreate = {
        code,
        region_id: region.id,
        ...giftCard,
      }

      const created = await giftCardRepo.create(toCreate)
      const result = await giftCardRepo.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(GiftCardService.Events.CREATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Gets a gift card by id.
   * @param {string} giftCardId - id of gift card to retrieve
   * @param {object} config - optional values to include with gift card query
   * @return {Promise<GiftCard>} the gift card
   */
  async retrieve(giftCardId, config = {}) {
    const giftCardRepo = this.manager_.getCustomRepository(
      this.giftCardRepository_
    )

    const validatedId = this.validateId_(giftCardId)

    const query = {
      where: { id: validatedId },
    }

    if (config.select) {
      query.select = config.select
    }

    if (config.relations) {
      query.relations = config.relations
    }

    const rels = query.relations
    delete query.relations

    const giftCard = await giftCardRepo.findOneWithRelations(rels, query)

    if (!giftCard) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Gift card with ${giftCardId} was not found`
      )
    }

    return giftCard
  }

  async retrieveByCode(code, config = {}) {
    const giftCardRepo = this.manager_.getCustomRepository(
      this.giftCardRepository_
    )

    const query = {
      where: { code },
    }

    if (config.select) {
      query.select = config.select
    }

    if (config.relations) {
      query.relations = config.relations
    }

    const rels = query.relations
    delete query.relations

    const giftCard = await giftCardRepo.findOneWithRelations(rels, query)

    if (!giftCard) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Gift card with ${code} was not found`
      )
    }

    return giftCard
  }

  /**
   * Updates a giftCard.
   * @param {string} giftCardId - giftCard id of giftCard to update
   * @param {GiftCard} update - the data to update the giftCard with
   * @return {Promise} the result of the update operation
   */
  async update(giftCardId, update) {
    return this.atomicPhase_(async (manager) => {
      const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

      const giftCard = await this.retrieve(giftCardId)

      const { region_id, metadata, balance, ...rest } = update

      if (region_id && region_id !== giftCard.region_id) {
        const region = await this.regionService_.retrieve(region_id)
        giftCard.region_id = region.id
      }

      if (metadata) {
        giftCard.metadata = await this.setMetadata_(giftCard.id, metadata)
      }

      if (typeof balance !== "undefined") {
        if (balance < 0 || giftCard.value < balance) {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "new balance is invalid"
          )
        }
        giftCard.balance = balance
      }

      for (const [key, value] of Object.entries(rest)) {
        giftCard[key] = value
      }

      const updated = await giftCardRepo.save(giftCard)
      return updated
    })
  }

  /**
   * Deletes a gift card idempotently
   * @param {string} giftCardId - id of gift card to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(giftCardId) {
    return this.atomicPhase_(async (manager) => {
      const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

      const giftCard = await giftCardRepo.findOne({ where: { id: giftCardId } })

      if (!giftCard) {
        return Promise.resolve()
      }

      await giftCardRepo.softRemove(giftCard)

      return Promise.resolve()
    })
  }
}

export default GiftCardService
