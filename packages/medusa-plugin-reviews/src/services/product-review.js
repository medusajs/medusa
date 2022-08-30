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
      const query = this.buildQuery_(selector, config)
      return await repository.find(query)
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
   * @return the result of the find one operation.
   */
  async retrieveByEmail(email) {
    const repository = this.manager_.getRepository(this.productReviewModel_)
    return await repository.findOne({ where: { email: email } })
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
        const productReview = repository.create(rest)
        return await repository.save(productReview)
      } catch (error) {
        console.log(error)
      }
    })
  }
}

export default ProductReviewService
