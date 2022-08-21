import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { buildQuery } from "../utils/build-query"

class ProductReviewService extends BaseService {
  constructor({ manager, productReviewModel }) {
    super()

    this.manager_ = manager
    this.productReviewModel_ = productReviewModel
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ProductReviewService({
      manager: transactionManager,
      productReviewModel: this.productReviewModel_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
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
    selector = {},
    config = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ) {
    return this.atomicPhase_(async (manager) => {
      const repository = manager.getRepository(this.productReviewModel_)

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
    selector = {},
    config = {
      relations: [],
      skip: 0,
      take: 20,
    }
  ) {
    return this.atomicPhase_(async (manager) => {
      const repository = manager.getRepository(this.productReviewModel_)

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
  async count(selector = {}) {
    return this.atomicPhase_(async (manager) => {
      const repository = manager.getRepository(this.productReviewModel_)

      const query = buildQuery(selector)
      return await repository.count(query)
    })
  }

  /**
   * Gets a customer product review by product_id.
   * Throws in case of DB Error and if customer product reviews was not found.
   * @param productId - id of the product to get.
   * @return the result of the find one operation.
   */
  async retrieve(productId) {
    const repository = this.manager_.getRepository(this.productReviewModel_)
    return await repository.findOne({ where: { product_id: productId } })
  }

  /**
   * Gets a product review by email.
   * Throws in case of DB Error and if product review was not found.
   * @param email - email of the product review to get.
   * @param config - details about what to get from the product
   * @return the result of the find one operation.
   */
  async retrieveByEmail(email, config = {}) {
    return await this.retrieve_({ email: email }, config)
  }

  /**
   * Gets a product by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve_(selector, config = {}) {
    return this.atomicPhase_(async (manager) => {
      const repository = manager.getRepository(this.productReviewModel_)

      const { relations, ...query } = buildQuery(selector, config)

      const productReview = await repository.findOneWithRelations(
        relations,
        query
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
  async create(productReviewObject) {
    return this.atomicPhase_(async (manager) => {
      const repository = manager.getRepository(this.productReviewModel_)

      const { ...rest } = productReviewObject

      try {
        let productReview = repository.create(rest)
        productReview = await repository.save(productReview)

        return await this.retrieve(productReview.id)
      } catch (error) {
        console.log(error)
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
  prepareListQuery_(selector, config) {
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

    const relations = query.relations
    delete query.relations

    return {
      query: query,
      relations: relations,
      q,
    }
  }
}

export default ProductReviewService
