import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"

class CustomShippingOptionService extends BaseService {
  constructor({ manager, customShippingOptionRepository }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {CustomShippingOptionRepository} */
    this.customShippingOptionRepository_ = customShippingOptionRepository
  }

  /**
   * Sets the service's manager to a given transaction manager
   * @param {EntityManager} manager - the manager to use
   * @return {CustomShippingOptionService} a cloned CustomShippingOption service
   */
  withTransaction(manager) {
    if (!manager) {
      return this
    }

    const cloned = new CustomShippingOptionService({
      manager,
      customShippingOptionRepository: this.customShippingOptionRepository_,
    })

    cloned.transactionManager_ = manager
    return cloned
  }

  /**
   * Retrieves a specific shipping option.
   * @param {string} id - the id of the custom shipping option to retrieve.
   * @param {*} config - any options needed to query for the result.
   * @return {Promise} which resolves to the requested custom shipping option.
   */
  async retrieve(id, config = {}) {
    const customShippingOptionRepo = this.manager_.getCustomRepository(
      this.customShippingOptionRepository_
    )

    const validatedId = this.validateId_(id)
    const query = this.buildQuery_({ id: validatedId }, config)

    const customShippingOption = await customShippingOptionRepo.findOne(query)

    if (!customShippingOption) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Custom shipping option with id: ${id} was not found.`
      )
    }

    return customShippingOption
  }

  /** Fetches all custom shipping options related to the given selector
   * @param {Object} selector - the query object for find
   * @param {Object} config - the configuration used to find the objects. contains relations, skip, and take.
   * @return {Promise<CustomShippingOption[]>} custom shipping options matching the query
   */
  async list(
    selector,
    config = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ) {
    const customShippingOptionRepo = this.manager_.getCustomRepository(
      this.customShippingOptionRepository_
    )

    const query = this.buildQuery_(selector, config)

    return customShippingOptionRepo.find(query)
  }

  /**
   * Creates a custom shipping option associated with a given author
   * @param {object} data - the custom shipping option to create
   * @param {*} config - any configurations if needed, including meta data
   * @return {Promise} resolves to the creation result
   */
  async create(data, config = { metadata: {} }) {
    const { metadata } = config

    const { cart_id, shipping_option_id, price } = data

    return this.atomicPhase_(async (manager) => {
      const customShippingOptionRepo = manager.getCustomRepository(
        this.customShippingOptionRepository_
      )

      const customShippingOption = await customShippingOptionRepo.create({
        cart_id,
        shipping_option_id,
        price,
        metadata,
      })
      const result = await customShippingOptionRepo.save(customShippingOption)

      return result
    })
  }
}

export default CustomShippingOptionService
