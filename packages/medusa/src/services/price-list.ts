import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { CustomerGroupService } from "."
import { Product } from "../models"
import { CustomerGroup } from "../models/customer-group"
import { PriceList } from "../models/price-list"
import { MoneyAmountRepository } from "../repositories/money-amount"
import { PriceListRepository } from "../repositories/price-list"
import { FindConfig } from "../types/common"
import {
  CreatePriceListInput,
  FilterablePriceListProps,
  PriceListPriceCreateInput,
  PriceListPriceUpdateInput,
  UpdatePriceListInput,
} from "../types/price-list"
import { formatException } from "../utils/exception-formatter"
import RegionService from "./region"
import ProductService from "./product"

type PriceListConstructorProps = {
  manager: EntityManager
  customerGroupService: CustomerGroupService
  regionService: RegionService
  productService: ProductService
  priceListRepository: typeof PriceListRepository
  moneyAmountRepository: typeof MoneyAmountRepository
}

/**
 * Provides layer to manipulate product tags.
 * @extends BaseService
 */
class PriceListService extends BaseService {
  private manager_: EntityManager
  private customerGroupService_: CustomerGroupService
  private regionService_: RegionService
  private productService_: ProductService
  private priceListRepo_: typeof PriceListRepository
  private moneyAmountRepo_: typeof MoneyAmountRepository

  constructor({
    manager,
    customerGroupService,
    regionService,
    productService,
    priceListRepository,
    moneyAmountRepository,
  }: PriceListConstructorProps) {
    super()
    this.manager_ = manager
    this.customerGroupService_ = customerGroupService
    this.productService_ = productService
    this.regionService_ = regionService
    this.priceListRepo_ = priceListRepository
    this.moneyAmountRepo_ = moneyAmountRepository
  }

  withTransaction(transactionManager: EntityManager): PriceListService {
    if (!transactionManager) {
      return this
    }

    const cloned = new PriceListService({
      manager: transactionManager,
      customerGroupService: this.customerGroupService_,
      productService: this.productService_,
      regionService: this.regionService_,
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
   * @param {CreatePriceListInput} priceListObject - the Price List to create
   * @return {Promise<PriceList>} created Price List
   */
  async create(priceListObject: CreatePriceListInput): Promise<PriceList> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const priceListRepo = manager.getCustomRepository(this.priceListRepo_)
      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const { prices, customer_groups, ...rest } = priceListObject

      try {
        const entity = priceListRepo.create(rest)

        const priceList = await priceListRepo.save(entity)

        if (prices) {
          await moneyAmountRepo.addPriceListPrices(priceList.id, prices)
        }

        if (customer_groups) {
          await this.upsertCustomerGroups_(priceList.id, customer_groups)
        }

        const result = await this.retrieve(priceList.id, {
          relations: ["prices", "customer_groups"],
        })

        return result
      } catch (error) {
        throw formatException(error)
      }
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
      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const priceList = await this.retrieve(id, { select: ["id"] })

      const { prices, customer_groups, ...rest } = update

      for (const [key, value] of Object.entries(rest)) {
        priceList[key] = value
      }

      await priceListRepo.save(priceList)

      if (prices) {
        const prices_ = await this.addCurrencyFromRegion(prices)
        await moneyAmountRepo.updatePriceListPrices(id, prices_)
      }

      if (customer_groups) {
        await this.upsertCustomerGroups_(id, customer_groups)
      }

      const result = await this.retrieve(id, {
        relations: ["prices", "customer_groups"],
      })

      return result
    })
  }

  /**
   * Adds prices to a price list in bulk, optionally replacing all existing prices
   * @param id - id of the price list
   * @param prices - prices to add
   * @param replace - whether to replace existing prices
   * @returns {Promise<PriceList>} updated Price List
   */
  async addPrices(
    id: string,
    prices: PriceListPriceCreateInput[],
    replace = false
  ): Promise<PriceList> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const priceList = await this.retrieve(id, { select: ["id"] })

      const prices_ = await this.addCurrencyFromRegion(prices)
      await moneyAmountRepo.addPriceListPrices(priceList.id, prices_, replace)

      const result = await this.retrieve(priceList.id, {
        relations: ["prices"],
      })

      return result
    })
  }

  /**
   * Removes prices from a price list and deletes the removed prices in bulk
   * @param id - id of the price list
   * @param priceIds - ids of the prices to delete
   * @returns {Promise<void>} updated Price List
   */
  async deletePrices(id: string, priceIds: string[]): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const priceList = await this.retrieve(id, { select: ["id"] })

      await moneyAmountRepo.deletePriceListPrices(priceList.id, priceIds)

      return Promise.resolve()
    })
  }

  /**
   * Deletes a Price List
   * Will never fail due to delete being idempotent.
   * @param id - id of the price list
   * @returns {Promise<void>} empty promise
   */
  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const priceListRepo = manager.getCustomRepository(this.priceListRepo_)

      const priceList = await priceListRepo.findOne({ where: { id: id } })
      if (!priceList) {
        return Promise.resolve()
      }

      await priceListRepo.delete(priceList)

      return Promise.resolve()
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
    const q = selector.q
    const { relations, ...query } = this.buildQuery_(selector, config)

    if (q) {
      delete query.where.q
      return await priceListRepo.getFreeTextSearchResultsAndCount(
        q,
        query,
        relations
      )
    }
    return await priceListRepo.findAndCount({ ...query, relations })
  }

  async upsertCustomerGroups_(
    priceListId: string,
    customerGroups: { id: string }[]
  ): Promise<void> {
    const priceListRepo = this.manager_.getCustomRepository(this.priceListRepo_)
    const priceList = await this.retrieve(priceListId, { select: ["id"] })

    const groups: CustomerGroup[] = []

    for (const cg of customerGroups) {
      const customerGroup = await this.customerGroupService_.retrieve(cg.id)
      groups.push(customerGroup)
    }

    priceList.customer_groups = groups

    await priceListRepo.save(priceList)
  }

  async listProducts(
    priceListId: string,
    selector = {},
    config: FindConfig<Product> = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<[Product[], number]> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const [products, count] = await this.productService_.listAndCount(
        selector,
        config
      )

      const moneyAmountRepo = manager.getCustomRepository(this.moneyAmountRepo_)

      const productsWithPrices = await Promise.all(
        products.map(async (p) => {
          if (p.variants?.length) {
            p.variants = await Promise.all(
              p.variants.map(async (v) => {
                const [prices] =
                  await moneyAmountRepo.findManyForVariantInPriceList(
                    v.id,
                    priceListId
                  )

                return {
                  ...v,
                  prices,
                }
              })
            )
          }

          return p
        })
      )

      return [productsWithPrices, count]
    })
  }

  /**
   * Add `currency_code` to an MA record if `region_id`is passed.
   * @param prices - a list of PriceListPrice(Create/Update)Input records
   * @return {Promise} updated `prices` list
   */
  protected async addCurrencyFromRegion<
    T extends PriceListPriceUpdateInput | PriceListPriceCreateInput
  >(prices: T[]): Promise<T[]> {
    const prices_: typeof prices = []

    for (const p of prices) {
      if (p.region_id) {
        const region = await this.regionService_
          .withTransaction(this.manager_)
          .retrieve(p.region_id)

        p.currency_code = region.currency_code
      }

      prices_.push(p)
    }

    return prices_
  }
}

export default PriceListService
