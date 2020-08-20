import { MedusaError } from "medusa-core-utils"

/**
 * Helps retrive fulfillment providers
 */
class FulfillmentProviderService {
  constructor(container) {
    /** @private {logger} */
    this.container_ = container
  }

  /**
   * @returns {FulfillmentService} the payment fulfillment provider
   */
  retrieveProvider(provider_id) {
    try {
      return this.container_.resolve(`fp_${provider_id}`)
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${provider_id}`
      )
    }
  }
}

export default FulfillmentProviderService
