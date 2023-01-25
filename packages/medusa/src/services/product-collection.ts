import { isDefined, MedusaError } from "medusa-core-utils"
import { Brackets, EntityManager, ILike } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ProductCollection } from "../models"
import { ProductRepository } from "../repositories/product"
import { ProductCollectionRepository } from "../repositories/product-collection"
import { FindConfig, Selector } from "../types/common"
import {
  CreateProductCollection,
  UpdateProductCollection,
} from "../types/product-collection"
import { buildQuery, isString, setMetadata } from "../utils"
import EventBusService from "./event-bus"

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  productRepository: typeof ProductRepository
  productCollectionRepository: typeof ProductCollectionRepository
}

/**
 * Provides layer to manipulate product collections.
 */
class ProductCollectionService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBus_: EventBusService
  // eslint-disable-next-line max-len
  protected readonly productCollectionRepository_: typeof ProductCollectionRepository
  protected readonly productRepository_: typeof ProductRepository

  constructor({
    manager,
    productCollectionRepository,
    productRepository,
    eventBusService,
  }: InjectedDependencies) {
    super(arguments[0])
    this.manager_ = manager

    this.productCollectionRepository_ = productCollectionRepository
    this.productRepository_ = productRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a product collection by id.
   * @param collectionId - the id of the collection to retrieve.
   * @param config - the config of the collection to retrieve.
   * @return the collection.
   */
  async retrieve(
    collectionId: string,
    config: FindConfig<ProductCollection> = {}
  ): Promise<ProductCollection> {
    if (!isDefined(collectionId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"collectionId" must be defined`
      )
    }

    const collectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const query = buildQuery({ id: collectionId }, config)
    const collection = await collectionRepo.findOne(query)

    if (!collection) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product collection with id: ${collectionId} was not found`
      )
    }

    return collection
  }

  /**
   * Retrieves a product collection by id.
   * @param collectionHandle - the handle of the collection to retrieve.
   * @param config - query config for request
   * @return the collection.
   */
  async retrieveByHandle(
    collectionHandle: string,
    config: FindConfig<ProductCollection> = {}
  ): Promise<ProductCollection> {
    const collectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const query = buildQuery({ handle: collectionHandle }, config)
    const collection = await collectionRepo.findOne(query)

    if (!collection) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product collection with handle: ${collectionHandle} was not found`
      )
    }

    return collection
  }

  /**
   * Creates a product collection
   * @param collection - the collection to create
   * @return created collection
   */
  async create(
    collection: CreateProductCollection
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const productCollection = collectionRepo.create(collection)
      return await collectionRepo.save(productCollection)
    })
  }

  /**
   * Updates a product collection
   * @param collectionId - id of collection to update
   * @param update - update object
   * @return update collection
   */
  async update(
    collectionId: string,
    update: UpdateProductCollection
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const collection = await this.retrieve(collectionId)

      const { metadata, ...rest } = update

      if (metadata) {
        collection.metadata = setMetadata(collection, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        collection[key] = value
      }

      return collectionRepo.save(collection)
    })
  }

  /**
   * Deletes a product collection idempotently
   * @param collectionId - id of collection to delete
   * @return empty promise
   */
  async delete(collectionId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const collection = await this.retrieve(collectionId)

      if (!collection) {
        return Promise.resolve()
      }

      await productCollectionRepo.softRemove(collection)

      return Promise.resolve()
    })
  }

  async addProducts(
    collectionId: string,
    productIds: string[]
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const { id } = await this.retrieve(collectionId, { select: ["id"] })

      await productRepo.bulkAddToCollection(productIds, id)

      return await this.retrieve(id, {
        relations: ["products"],
      })
    })
  }

  async removeProducts(
    collectionId: string,
    productIds: string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const { id } = await this.retrieve(collectionId, { select: ["id"] })

      await productRepo.bulkRemoveFromCollection(productIds, id)

      return Promise.resolve()
    })
  }

  /**
   * Lists product collections
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<ProductCollection> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config = { skip: 0, take: 20 }
  ): Promise<ProductCollection[]> {
    const [collections] = await this.listAndCount(selector, config)
    return collections
  }

  /**
   * Lists product collections and add count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<ProductCollection> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductCollection> = { skip: 0, take: 20 }
  ): Promise<[ProductCollection[], number]> {
    const productCollectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where

      delete where.title
      delete where.handle
      delete where.created_at
      delete where.updated_at

      query.where = (qb): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where({ title: ILike(`%${q}%`) }).orWhere({
              handle: ILike(`%${q}%`),
            })
          })
        )
      }
    }

    if (query.where.discount_condition_id) {
      const discountConditionId = query.where.discount_condition_id as string
      delete query.where.discount_condition_id
      return await productCollectionRepo.findAndCountByDiscountConditionId(
        discountConditionId,
        query
      )
    }

    return await productCollectionRepo.findAndCount(query)
  }
}

export default ProductCollectionService
