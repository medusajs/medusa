import { MedusaError } from "medusa-core-utils"
import { BaseService } from "../interfaces"
import { EntityManager } from "typeorm"

class CustomShippingOptionService extends BaseService {
  constructor(cradle) {
    super(cradle)

    /** @private @const {EntityManager} */
    this.manager_ = cradle.manager

    /** @private @const {CustomShippingOptionRepository} */
    this.customShippingOptionRepository_ = cradle.customShippingOptionRepository
  }

  /**
   * Retrieves a specific shipping option.
   * @param {string} id - the id of the custom shipping option to retrieve.
   * @param {*} config - any options needed to query for the result.
   * @return {Promise<CustomShippingOption>} which resolves to the requested custom shipping option.
   */
  async retrieve(id, config = {}) {
    return await this.atomicPhase_(async (transactionManager) => {
      const customShippingOptionRepo = transactionManager.getCustomRepository(
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
    })
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
    return await this.atomicPhase_(async (transactionManager) => {
      const customShippingOptionRepo = transactionManager.getCustomRepository(
        this.customShippingOptionRepository_
      )

      const query = this.buildQuery_(selector, config)

      return customShippingOptionRepo.find(query)
    })
  }

  /**
   * Creates a custom shipping option associated with a given author
   * @param {object} data - the custom shipping option to create
   * @param {*} config - any configurations if needed, including meta data
   * @return {Promise<CustomShippingOption>} resolves to the creation result
   */
  async create(data, config = { metadata: {} }) {
    const { metadata } = config

    const { cart_id, shipping_option_id, price } = data

    return await this.atomicPhase_(async (transactionManager) => {
      const customShippingOptionRepo = transactionManager.getCustomRepository(
        this.customShippingOptionRepository_
      )

      const customShippingOption = await customShippingOptionRepo.create({
        cart_id,
        shipping_option_id,
        price,
        metadata,
      })
      return await customShippingOptionRepo.save(customShippingOption)
    })
  }
}

export default CustomShippingOptionService
