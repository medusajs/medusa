import { BaseService } from "medusa-interfaces"
import { MedusaError } from "medusa-core-utils"

/**
 * Provides layer to manipulate product collections.
 * @extends BaseService
 */
class ProductCollectionService extends BaseService {
  constructor({
    manager,
    productCollectionRepository,
    productRepository,
    eventBusService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ProductCollectionRepository} */
    this.productCollectionRepository_ = productCollectionRepository

    /** @private @const {ProductRepository} */
    this.productRepository_ = productRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductCollectionService({
      manager: transactionManager,
      productCollectionRepository: this.productCollectionRepository_,
      productRepository: this.productRepository_,
      eventBusService: this.eventBus_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Retrieves a product collection by id.
   * @param {string} collectionId - the id of the collection to retrieve.
   * @param {Object} config - the config of the collection to retrieve.
   * @return {Promise<ProductCollection>} the collection.
   */
  async retrieve(collectionId, config = {}) {
    const collectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const validatedId = this.validateId_(collectionId)

    const query = this.buildQuery_({ id: validatedId }, config)
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
   * Creates a product collection
   * @param {object} collection - the collection to create
   * @return {Promise<ProductCollection>} created collection
   */
  async create(collection) {
    return this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const productCollection = collectionRepo.create(collection)
      return collectionRepo.save(productCollection)
    })
  }

  /**
   * Updates a product collection
   * @param {string} collectionId - id of collection to update
   * @param {object} update - update object
   * @return {Promise<ProductCollection>} update collection
   */
  async update(collectionId, update) {
    return this.atomicPhase_(async (manager) => {
      const collectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      )

      const collection = await this.retrieve(collectionId)

      const { metadata, ...rest } = update

      if (metadata) {
        collection.metadata = this.setMetadata_(collection, metadata)
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
  async delete(collectionId) {
    return this.atomicPhase_(async (manager) => {
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

  /**
   * Lists product collections
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { skip: 0, take: 20 }) {
    const productCollectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const query = this.buildQuery_(selector, config)
    return await productCollectionRepo.find(query)
  }

  /**
   * Lists product collections and add count.
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
  async listAndCount(selector = {}, config = { skip: 0, take: 20 }) {
    const productCollectionRepo = this.manager_.getCustomRepository(
      this.productCollectionRepository_
    )

    const query = this.buildQuery_(selector, config)
    return await productCollectionRepo.findAndCount(query)
  }
}

export default ProductCollectionService
