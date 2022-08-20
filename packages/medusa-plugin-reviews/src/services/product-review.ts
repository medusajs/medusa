import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import {
  FindWithoutRelationsOptions,
  ProductReviewRepository,
} from "../repositories/product-review"
import { ProductReview } from "../models/product-review"
import {
  CreateProductReviewInput,
  FilterableProductReviewProps,
  FindProductReviewConfig,
} from "../types/product-review"
import { EventBusService, TransactionBaseService } from "@medusajs/medusa"
import { Selector } from "@medusajs/medusa/dist/types/common"
import { buildQuery } from "@medusajs/medusa/dist/utils"
import { formatException } from "@medusajs/medusa/dist/utils/exception-formatter"

type InjectedDependencies = {
  manager: EntityManager
  productReviewRepository: typeof ProductReviewRepository
  eventBusService: EventBusService
}

class ProductReviewService extends TransactionBaseService<
  ProductReviewService
> {
  static readonly IndexName = `product-reviews`

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly productReviewRepository_: typeof ProductReviewRepository
  protected readonly eventBus_: EventBusService

  constructor({
    manager,
    productReviewRepository,
    eventBusService,
  }: InjectedDependencies) {
    super({
      manager,
      productReviewRepository,
      eventBusService,
    })

    this.manager_ = manager
    this.productReviewRepository_ = productReviewRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Lists customer product reviews based on the provided parameters.
   * @param selector - an object that defines rules to filter customer product reviews
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return the result of the find operation
   */
  async list(
    selector: FilterableProductReviewProps | Selector<ProductReview> = {},
    config: FindProductReviewConfig = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<ProductReview[]> {
    return await this.atomicPhase_(async (manager) => {
      const repository = manager.getCustomRepository(
        this.productReviewRepository_
      )

      const { q, query, relations } = this.prepareListQuery_(selector, config)
      if (q) {
        const [products] = await repository.getFreeTextSearchResultsAndCount(
          q,
          query,
          relations
        )
        return products
      }

      return await repository.findWithRelations(relations, query)
    })
  }

  /**
   * Lists products based on the provided parameters and includes the count of
   * customer product reviews that match the query.
   * @param selector - an object that defines rules to filter customer product reviews
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return an array containing the customer product reviews as
   *   the first element and the total count of customer product reviews that matches the query
   *   as the second element.
   */
  async listAndCount(
    selector: FilterableProductReviewProps | Selector<ProductReview>,
    config: FindProductReviewConfig = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ): Promise<[ProductReview[], number]> {
    return await this.atomicPhase_(async (manager) => {
      const repository = manager.getCustomRepository(
        this.productReviewRepository_
      )

      const { q, query, relations } = this.prepareListQuery_(selector, config)

      if (q) {
        return await repository.getFreeTextSearchResultsAndCount(
          q,
          query,
          relations
        )
      }

      return await repository.findWithRelationsAndCount(relations, query)
    })
  }

  /**
   * Return the total number of documents in database
   * @param {object} selector - the selector to choose customer product reviews by
   * @return {Promise} the result of the count operation
   */
  async count(selector: Selector<ProductReview> = {}): Promise<number> {
    return await this.atomicPhase_(async (manager) => {
      const repository = manager.getCustomRepository(
        this.productReviewRepository_
      )
      const query = buildQuery(selector)
      return await repository.count(query)
    })
  }

  /**
   * Gets a customer product review by product_id.
   * Throws in case of DB Error and if customer product reviews was not found.
   * @param productId - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve(
    productId: string,
    config: FindProductReviewConfig = {}
  ): Promise<ProductReview> {
    return await this.atomicPhase_(async () => {
      return await this.retrieve_({ product_id: productId }, config)
    })
  }

  /**
   * Gets a product review by email.
   * Throws in case of DB Error and if product review was not found.
   * @param email - email of the product review to get.
   * @param config - details about what to get from the product
   * @return the result of the find one operation.
   */
  async retrieveByEmail(
    email: string,
    config: FindProductReviewConfig = {}
  ): Promise<ProductReview> {
    return await this.atomicPhase_(async () => {
      return await this.retrieve_({ email: email }, config)
    })
  }

  /**
   * Gets a product by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(
    selector: Selector<ProductReview>,
    config: FindProductReviewConfig = {}
  ): Promise<ProductReview> {
    return await this.atomicPhase_(async (manager) => {
      const repository = manager.getCustomRepository(
        this.productReviewRepository_
      )

      const { relations, ...query } = buildQuery(selector, config)

      const productReview = await repository.findOneWithRelations(
        relations,
        query as FindWithoutRelationsOptions
      )

      if (!productReview) {
        const selectorConstraints = Object.entries(selector)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")

        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Product with ${selectorConstraints} was not found`
        )
      }

      return productReview
    })
  }

  /**
   * Creates a product.
   * @param productReviewObject - the product to create
   * @return resolves to the creation result.
   */
  async create(
    productReviewObject: CreateProductReviewInput
  ): Promise<ProductReview> {
    return await this.atomicPhase_(async (manager) => {
      const repository = manager.getCustomRepository(
        this.productReviewRepository_
      )

      const { ...rest } = productReviewObject

      try {
        let productReview = repository.create(rest)
        productReview = await repository.save(productReview)

        return await this.retrieve(productReview.id)
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareListQuery_(
    selector: FilterableProductReviewProps | Selector<ProductReview>,
    config: FindProductReviewConfig
  ): {
    q: string
    relations: (keyof ProductReview)[]
    query: FindWithoutRelationsOptions
  } {
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query: query as FindWithoutRelationsOptions,
      relations: rels as (keyof ProductReview)[],
      q,
    }
  }
}

export default ProductReviewService
