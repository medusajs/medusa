import { MedusaError } from "medusa-core-utils"

/**
 * Helps retrive payment providers
 */
class PaymentProviderService {
  constructor(container) {
    /** @private {logger} */
    this.container_ = container
  }

  /**
   * Handles incoming jobs.
   * @param job {{ eventName: (string), data: (any) }}
   *    eventName - the name of the event to process
   *    data - data to send to the subscriber
   *
   * @returns {PaymentService} the payment provider
   */
  retrieveProvider(provider_id) {
    try {
      const provider = this.container_.resolve(`pp_${provider_id}`)
      return provider
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a payment provider with id: ${provider_id}`
      )
    }
  }
}

export default PaymentProviderService
