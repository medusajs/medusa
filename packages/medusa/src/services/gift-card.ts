import { isDefined, MedusaError } from "medusa-core-utils"
import randomize from "randomatic"
import { EntityManager } from "typeorm"
import { EventBusService } from "."
import { TransactionBaseService } from "../interfaces"
import { GiftCard, Region } from "../models"
import { GiftCardRepository } from "../repositories/gift-card"
import { GiftCardTransactionRepository } from "../repositories/gift-card-transaction"
import {
  ExtendedFindConfig,
  FindConfig,
  QuerySelector,
  Selector,
} from "../types/common"
import {
  CreateGiftCardInput,
  CreateGiftCardTransactionInput,
  UpdateGiftCardInput,
} from "../types/gift-card"
import { buildQuery, setMetadata } from "../utils"
import RegionService from "./region"

type InjectedDependencies = {
  manager: EntityManager
  giftCardRepository: typeof GiftCardRepository
  giftCardTransactionRepository: typeof GiftCardTransactionRepository
  regionService: RegionService
  eventBusService: EventBusService
}
/**
 * Provides layer to manipulate gift cards.
 */
class GiftCardService extends TransactionBaseService {
  protected readonly giftCardRepository_: typeof GiftCardRepository
  // eslint-disable-next-line max-len
  protected readonly giftCardTransactionRepo_: typeof GiftCardTransactionRepository
  protected readonly regionService_: RegionService
  protected readonly eventBus_: EventBusService

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  static Events = {
    CREATED: "gift_card.created",
  }

  constructor({
    manager,
    giftCardRepository,
    giftCardTransactionRepository,
    regionService,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager

    this.giftCardRepository_ = giftCardRepository
    this.giftCardTransactionRepo_ = giftCardTransactionRepository
    this.regionService_ = regionService
    this.eventBus_ = eventBusService
  }

  /**
   * Generates a 16 character gift card code
   * @return the generated gift card code
   */
  static generateCode(): string {
    const code = [
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
      randomize("A0", 4),
    ].join("-")

    return code
  }

  /**
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return the result of the find operation
   */
  async listAndCount(
    selector: QuerySelector<GiftCard> = {},
    config: FindConfig<GiftCard> = { relations: [], skip: 0, take: 10 }
  ): Promise<[GiftCard[], number]> {
    const manager = this.manager_
    const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

    let q: string | undefined
    if (isDefined(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query: ExtendedFindConfig<
      GiftCard,
      QuerySelector<GiftCard>
    > = buildQuery<QuerySelector<GiftCard>, GiftCard>(selector, config)

    const rels = query.relations
    delete query.relations

    return await giftCardRepo.listGiftCardsAndCount(query, rels, q)
  }

  /**
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return the result of the find operation
   */
  async list(
    selector: QuerySelector<GiftCard> = {},
    config: FindConfig<GiftCard> = { relations: [], skip: 0, take: 10 }
  ): Promise<GiftCard[]> {
    const manager = this.manager_
    const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

    let q: string | undefined
    if (isDefined(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query: ExtendedFindConfig<
      GiftCard,
      QuerySelector<GiftCard>
    > = buildQuery<QuerySelector<GiftCard>, GiftCard>(selector, config)

    const rels = query.relations
    delete query.relations

    return await giftCardRepo.listGiftCards(query, rels, q)
  }

  async createTransaction(
    data: CreateGiftCardTransactionInput
  ): Promise<string> {
    const manager = this.manager_
    const gctRepo = manager.getCustomRepository(this.giftCardTransactionRepo_)
    const created = gctRepo.create(data)
    const saved = await gctRepo.save(created)
    return saved.id
  }

  /**
   * Creates a gift card with provided data given that the data is validated.
   * @param giftCard - the gift card data to create
   * @return the result of the create operation
   */
  async create(giftCard: CreateGiftCardInput): Promise<GiftCard> {
    return await this.atomicPhase_(async (manager) => {
      const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

      // Will throw if region does not exist
      const region = await this.regionService_
        .withTransaction(manager)
        .retrieve(giftCard.region_id)

      const code = GiftCardService.generateCode()
      const taxRate = GiftCardService.resolveTaxRate(giftCard.tax_rate || null, region)
      const toCreate = {
        code,
        ...giftCard,
        region_id: region.id,
        tax_rate: taxRate,
      }

      const created = giftCardRepo.create(toCreate)
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
   * The tax_rate of the giftcard can depend on whether regions tax gift cards, an input
   * provided by the user or the tax rate. Based on these conditions, tax_rate changes.
   * @return the tax rate for the gift card
   */
  protected static resolveTaxRate(
    giftCardTaxRate: number | null,
    region: Region
  ): number | null {
    // A gift card is always associated with a region. If the region doesn't tax gift cards,
    // return null
    if (!region.gift_cards_taxable) return null

    // If a tax rate has been provided as an input from an external input, use that
    // This would handle cases where gift cards are created as a part of an order where taxes better defined
    // or to handle usecases outside of the opinions of the core.
    if (giftCardTaxRate) {
      return giftCardTaxRate
    }

    // Outside the context of the taxRate input, it picks up the tax rate directly from the region
    return region.tax_rate || null
  }

  protected async retrieve_(
    selector: Selector<GiftCard>,
    config: FindConfig<GiftCard> = {}
  ): Promise<GiftCard> {
    const manager = this.manager_
    const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

    const { relations, ...query } = buildQuery(selector, config)

    const giftCard = await giftCardRepo.findOneWithRelations(
      relations as (keyof GiftCard)[],
      query
    )

    if (!giftCard) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Gift card with ${selectorConstraints} was not found`
      )
    }

    return giftCard
  }

  /**
   * Gets a gift card by id.
   * @param giftCardId - id of gift card to retrieve
   * @param config - optional values to include with gift card query
   * @return the gift card
   */
  async retrieve(
    giftCardId: string,
    config: FindConfig<GiftCard> = {}
  ): Promise<GiftCard> {
    if (!isDefined(giftCardId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"giftCardId" must be defined`
      )
    }

    return await this.retrieve_({ id: giftCardId }, config)
  }

  async retrieveByCode(
    code: string,
    config: FindConfig<GiftCard> = {}
  ): Promise<GiftCard> {
    if (!isDefined(code)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"code" must be defined`
      )
    }

    return await this.retrieve_({ code }, config)
  }

  /**
   * Updates a giftCard.
   * @param giftCardId - giftCard id of giftCard to update
   * @param update - the data to update the giftCard with
   * @return the result of the update operation
   */
  async update(
    giftCardId: string,
    update: UpdateGiftCardInput
  ): Promise<GiftCard> {
    return await this.atomicPhase_(async (manager) => {
      const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

      const giftCard = await this.retrieve(giftCardId)

      const { region_id, metadata, balance, ...rest } = update

      if (region_id && region_id !== giftCard.region_id) {
        const region = await this.regionService_
          .withTransaction(manager)
          .retrieve(region_id)
        giftCard.region_id = region.id
      }

      if (metadata) {
        giftCard.metadata = setMetadata(giftCard, metadata)
      }

      if (isDefined(balance)) {
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

      return await giftCardRepo.save(giftCard)
    })
  }

  /**
   * Deletes a gift card idempotently
   * @param giftCardId - id of gift card to delete
   * @return the result of the delete operation
   */
  async delete(giftCardId: string): Promise<GiftCard | void> {
    const manager = this.manager_
    const giftCardRepo = manager.getCustomRepository(this.giftCardRepository_)

    const giftCard = await giftCardRepo.findOne({ where: { id: giftCardId } })

    if (!giftCard) {
      return
    }

    return await giftCardRepo.softRemove(giftCard)
  }
}

export default GiftCardService
