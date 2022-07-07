import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Brackets, EntityManager, ILike, SelectQueryBuilder } from "typeorm"
import { formatException } from "../utils/exception-formatter"
import { ProductRepository } from "../repositories/product"
import { ImageRepository } from "../repositories/image"
import EventBusService from "./event-bus"
import { ProductCollectionRepository } from "../repositories/product-collection"
import { TransactionBaseService } from "../interfaces"
import { ProductCollection } from "../models"
import { buildQuery, setMetadata, validateId } from "../utils"
import { FindConfig, Selector } from "../types/common"
import { FindProductConfig } from "../types/product"
import {
  FilterableProductCollectionProps,
  ProductCollectionInput,
} from "../types/product-collection"

type InjectedDependencies = {
  manager: EntityManager
  productCollectionRepository: typeof ProductCollectionRepository
  productRepository: typeof ProductRepository
  eventBusService: EventBusService
  imageRepository: typeof ImageRepository
}

/**
 * Provides layer to manipulate product collections.
 * @extends BaseService
 */
class ProductCollectionService extends TransactionBaseService<ProductCollectionService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly productCollectionRepository_: typeof ProductCollectionRepository
  protected readonly productRepository_: typeof ProductRepository
  protected readonly eventBus_: EventBusService
  protected readonly imageRepository_: typeof ImageRepository

  constructor({
    manager,
    productCollectionRepository,
    productRepository,
    eventBusService,
    imageRepository,
  }: InjectedDependencies) {
    super({
      productCollectionRepository,
      manager,
      productRepository,
      eventBusService,
      imageRepository,
    })

    this.manager_ = manager
    this.productCollectionRepository_ = productCollectionRepository
    this.productRepository_ = productRepository
    this.eventBus_ = eventBusService
    this.imageRepository_ = imageRepository
  }

  /**
   * Retrieves a product collection by id.
   * @param {string} collectionId - the id of the collection to retrieve.
   * @param {Object} config - the config of the collection to retrieve.
   * @return {Promise<ProductCollection>} the collection.
   */
  async retrieve(
    collectionId: string,
    config: object = {}
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async () => {
      const validatedId = validateId(collectionId)
      return await this.retrieve_({ id: validatedId }, config)
    })
  }

  /**
   * Gets a product collection by selector.
   * Throws in case of DB Error and if product collection was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(
    selector: Selector<ProductCollection>,
    config: object
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const { ...query } = buildQuery(selector, config)
      const collection = await collectionRepo.findOne(query)

      if (!collection) {
        const selectorConstraints = Object.entries(selector)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")

        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product collection with: ${selectorConstraints} was not found`
        )
      }

      return collection
    })
  }

  /**
   * Gets a product collection by handle.
   * Throws in case of DB Error and if product collection was not found.
   * @param collectionHandle - handle of the product collection to get.
   * @param config - details about what to get from the product collection
   * @return the result of the find one operation.
   */
  async retrieveByHandle(
    collectionHandle: string,
    config: FindProductConfig = {}
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async () => {
      return await this.retrieve_({ handle: collectionHandle }, config)
    })
  }

  /**
   * Creates a product collection
   * @param {object} collection - the collection to create
   * @return {Promise<ProductCollection>} created collection
   */
  async create(
    collection: ProductCollectionInput | any
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )
      const imageRepo = manager.getCustomRepository(this.imageRepository_)

      const { images, ...rest } = collection as ProductCollectionInput
      if (!rest.thumbnail && images?.length) {
        rest.thumbnail = images[0]
      }

      try {
        const productCollection = await collectionRepo.create(rest)

        if (images?.length) {
          productCollection.images = await imageRepo.upsertImages(images)
        }

        await collectionRepo.save(productCollection)

        return await this.retrieve(productCollection.id, {})
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  /**
   * Updates a product collection
   * @param {string} collectionId - id of collection to update
   * @param {object} update - update object
   * @return {Promise<ProductCollection>} update collection
   */
  async update(
    collectionId: string,
    update: ProductCollectionInput | any
  ): Promise<ProductCollection> {
    return await this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )
      const imageRepo = this.manager_.getCustomRepository(this.imageRepository_)

      const collection = await this.retrieve(collectionId, {
        relations: ["images"],
      })

      const { metadata, images, ...rest } = update as ProductCollectionInput

      if (!collection.thumbnail && !update.thumbnail && images?.length) {
        collection.thumbnail = images[0]
      }

      if (images) {
        collection.images = await imageRepo.upsertImages(images)
      }

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
   * @param {string} collectionId - id of collection to delete
   * @return {Promise} empty promise
   */
  async delete(collectionId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const collection = await productCollectionRepo.findOne({
        id: collectionId,
      })

      if (!collection) {
        return
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

      try {
        const { id } = await this.retrieve(collectionId, { select: ["id"] })

        await productRepo.bulkAddToCollection(productIds, id)

        return await this.retrieve(id, {
          relations: ["products"],
        })
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  async removeProducts(
    collectionId: string,
    productIds: string[]
  ): Promise<ProductCollection | void> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const { id } = await this.retrieve(collectionId, { select: ["id"] })

      await productRepo.bulkRemoveFromCollection(productIds, id)

      return Promise.resolve()
    })
  }

  /**
   * Lists product collections
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async list(
    selector:
      | FilterableProductCollectionProps
      | Selector<ProductCollection> = {},
    config: object = {
      skip: 0,
      take: 20,
    }
  ): Promise<ProductCollection[]> {
    return await this.atomicPhase_(async (manager) => {
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const query = buildQuery(selector, config)

      return await productCollectionRepo.find(query)
    })
  }

  /**
   * Lists product collections and add count.
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableProductCollectionProps = {},
    config: FindConfig<ProductCollection> = {
      take: 20,
      skip: 0,
    }
  ): Promise<[ProductCollection[], number]> {
    return await this.atomicPhase_(async (manager) => {
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      let q
      if ("q" in selector) {
        q = selector.q
        delete selector.q
      }

      const query = buildQuery(selector as Selector<ProductCollection>, config)

      if (q) {
        const where = query.where

        delete where.title
        delete where.handle

        query.where = (qb: SelectQueryBuilder<ProductCollection>): void => {
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

      return await productCollectionRepo.findAndCount(query)
    })
  }
}

export default ProductCollectionService
