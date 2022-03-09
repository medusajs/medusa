import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { PriceList } from "../models/price-list"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { PriceListRepository } from "../repositories/price-list"
import { FindConfig } from "../types/common"
import {
  CreatePriceListInput,
  FilterablePriceListProps,
  PriceListPriceCreateInput,
  UpdatePriceListInput,
} from "../types/price-list"

type PriceListConstructorProps = {
  manager: EntityManager
  priceListRepository: typeof PriceListRepository
  moneyAmountRepository: typeof MoneyAmountRepository
}

/**
 * Provides layer to manipulate product tags.
 * @extends BaseService
 */
class PriceListService extends BaseService {
  private manager_: EntityManager
  private priceListRepo_: typeof PriceListRepository
  private moneyAmountRepo_: typeof MoneyAmountRepository

  constructor({
    manager,
    priceListRepository,
    moneyAmountRepository,
  }: PriceListConstructorProps) {
    super()
    this.manager_ = manager
    this.priceListRepo_ = priceListRepository
    this.moneyAmountRepo_ = moneyAmountRepository
  }

  withTransaction(transactionManager: EntityManager): PriceListService {
    if (!transactionManager) {
      return this
    }

    const cloned = new PriceListService({
      manager: transactionManager,
      priceListRepository: this.priceListRepo_,
      moneyAmountRepository: this.moneyAmountRepo_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Retrieves a product tag by id.
   * @param {string} priceListId - the id of the product tag to retrieve
   * @param {Object} config - the config to retrieve the tag by
   * @return {Promise<PriceList>} the collection.
   */
  async retrieve(
    priceListId: string,
    config: FindConfig<PriceList> = {}
  ): Promise<PriceList> {
    const priceListRepo = this.manager_.getCustomRepository(this.priceListRepo_)

    const query = this.buildQuery_({ id: priceListId }, config)
    const priceList = await priceListRepo.findOne(query)

    if (!priceList) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Price list with id: ${priceListId} was not found`
      )
    }

    return priceList
  }

  /**
   * Creates a Price List
   * @param {CreatePriceListInput} priceList - the product tag to create
   * @return {Promise<PriceList>} created product tag
   */
  async create(priceList: CreatePriceListInput): Promise<PriceList> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const priceListRepo = manager.getCustomRepository(this.priceListRepo_)

      const productTag = priceListRepo.create(priceList)
      return await priceListRepo.save(productTag)
    })
  }

  /**
   * Updates a Price List
   * @param {string} id - the id of the Product List to update
   * @param {UpdatePriceListInput} update - the update to apply
   * @returns {Promise<PriceList>} updated Price List
   */
  async update(id: string, update: UpdatePriceListInput): Promise<PriceList> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const priceListRepo = manager.getCustomRepository(this.priceListRepo_)

      const priceList = await priceListRepo.findOne(id)
      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Price list with id: ${id} was not found`
        )
      }

      Object.assign(priceList, update)
      return await priceListRepo.save(priceList)
    })
  }

  async addPrices(
    id: string,
    prices: PriceListPriceCreateInput[],
    replace = false
  ): Promise<PriceList> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const priceListRepo = manager.getCustomRepository(this.priceListRepo_)
      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const priceList = await priceListRepo.findOne(id, { select: ["id"] })
      if (!priceList) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Price list with id: ${id} was not found`
        )
      }

      await moneyAmountRepo.addToPriceList(id, prices, replace)

      const result = await priceListRepo.findOne(id, { relations: ["prices"] })

      return result
    })
  }

  /**
   * Lists Price Lists
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise<PriceList[]>} the result of the find operation
   */
  async list(
    selector: FilterablePriceListProps = {},
    config: FindConfig<PriceList> = { skip: 0, take: 20 }
  ): Promise<PriceList[]> {
    const priceListRepo = this.manager_.getCustomRepository(this.priceListRepo_)

    const query = this.buildQuery_(selector, config)
    return await priceListRepo.find(query)
  }

  /**
   * Lists Price Lists and adds count
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterablePriceListProps = {},
    config: FindConfig<PriceList> = { skip: 0, take: 20 }
  ): Promise<[PriceList[], number]> {
    const priceListRepo = this.manager_.getCustomRepository(this.priceListRepo_)

    const query = this.buildQuery_(selector, config)
    return await priceListRepo.findAndCount(query)
  }
}

export default PriceListService
