import { isDefined, MedusaError } from "medusa-core-utils"
import {
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
} from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { ProductCollection } from "../models"
import { ProductRepository } from "../repositories/product"
import { ProductCollectionRepository } from "../repositories/product-collection"
import { ExtendedFindConfig, FindConfig, Selector } from "../types/common"
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

type ListAndCountSelector = Selector<ProductCollection> & {
  q?: string
  discount_condition_id?: string
}

/**
 * Provides layer to manipulate product collections.
 */
class ProductCollectionService extends TransactionBaseService {
  protected readonly eventBus_: EventBusService
  // eslint-disable-next-line max-len
  protected readonly productCollectionRepository_: typeof ProductCollectionRepository
  protected readonly productRepository_: typeof ProductRepository

  static readonly Events = {
    CREATED: "product-collection.created",
    UPDATED: "product-collection.updated",
    DELETED: "product-collection.deleted",
    PRODUCTS_ADDED: "product-collection.products_added",
    PRODUCTS_REMOVED: "product-collection.products_removed",
  }

  constructor({
    productCollectionRepository,
    productRepository,
    eventBusService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

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

    const collectionRepo = this.activeManager_.withRepository(
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
    const collectionRepo = this.activeManager_.withRepository(
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
      const collectionRepo = manager.withRepository(
        this.productCollectionRepository_
      )
      let productCollection = collectionRepo.create(collection)
      productCollection = await collectionRepo.save(productCollection);

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductCollectionService.Events.CREATED, {
          id: productCollection.id,
        })

      return productCollection
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
      const collectionRepo = manager.withRepository(
        this.productCollectionRepository_
      )

      let productCollection = await this.retrieve(collectionId)

      const { metadata, ...rest } = update

      if (metadata) {
        productCollection.metadata = setMetadata(productCollection, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        productCollection[key] = value
      }

      productCollection = await collectionRepo.save(productCollection)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductCollectionService.Events.UPDATED, {
          id: productCollection.id,
        })

      return productCollection
    })
  }

  /**
   * Deletes a product collection idempotently
   * @param collectionId - id of collection to delete
   * @return empty promise
   */
  async delete(collectionId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCollectionRepo = manager.withRepository(
        this.productCollectionRepository_
      )

      const productCollection = await this.retrieve(collectionId)

      if (!productCollection) {
        return Promise.resolve()
      }

      await productCollectionRepo.softRemove(productCollection)

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductCollectionService.Events.DELETED, {
          id: productCollection.id,
      })

      return Promise.resolve()
    })
  }

  async addProducts(
    collectionId: string,
    productIds: string[]
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)

      const { id } = await this.retrieve(collectionId, { select: ["id"] })

      await productRepo.bulkAddToCollection(productIds, id)

      const productCollection = await this.retrieve(id, {
        relations: ["products"],
      })

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductCollectionService.Events.PRODUCTS_ADDED, {
          productCollection: productCollection,
          productIds: productIds, 
        })

      return productCollection
    })
  }

  async removeProducts(
    collectionId: string,
    productIds: string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.withRepository(this.productRepository_)

      const { id } = await this.retrieve(collectionId, { select: ["id"] })

      await productRepo.bulkRemoveFromCollection(productIds, id)

      const productCollection = await this.retrieve(id, {
        relations: ["products"],
      })

      await this.eventBus_
        .withTransaction(manager)
        .emit(ProductCollectionService.Events.PRODUCTS_REMOVED, {
          productCollection: productCollection,
          productIds: productIds, 
        })

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
    selector: ListAndCountSelector = {},
    config: FindConfig<ProductCollection> = { skip: 0, take: 20 }
  ): Promise<[ProductCollection[], number]> {
    const productCollectionRepo = this.activeManager_.withRepository(
      this.productCollectionRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(
      selector,
      config
    ) as FindManyOptions<ProductCollection> & {
      where: { discount_condition_id?: string }
    } & ExtendedFindConfig<ProductCollection>

    if (q) {
      const where = query.where as FindOptionsWhere<ProductCollection>

      delete where.title
      delete where.handle
      delete where.created_at
      delete where.updated_at

      query.where = [
        {
          ...where,
          title: ILike(`%${q}%`),
        },
        {
          ...where,
          handle: ILike(`%${q}%`),
        },
      ]
    }

    if (query.where.discount_condition_id) {
      const discountConditionId = query.where.discount_condition_id
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
