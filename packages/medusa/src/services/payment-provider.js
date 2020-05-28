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
   * Creates a payment session with the given provider.
   * @param {string} providerId - the id of the provider to create payment with
   * @param {Cart} cart - a cart object used to calculate the amount, etc. from
   * @return {Promise} the payment session
   */
  createSession(providerId, cart) {
    const provider = this.retrieveProvider(providerId)
    return provider.createPayment(cart)
  }

  /**
   * Updates an existing payment session.
   * @param {PaymentSession} paymentSession - the payment session object to
   *    update
   * @param {Cart} cart - the cart object to update for
   * @return {Promise} the updated payment session
   */
  updateSession(paymentSession, cart) {
    const provider = this.retrieveProvider(paymentSession.provider_id)
    return provider.updatePayment(paymentSession.data, cart)
  }

  /**
   * Finds a provider given an id
   * @param {string} providerId - the id of the provider to get
   * @returns {PaymentService} the payment provider
   */
  retrieveProvider(providerId) {
    try {
      const provider = this.container_[`pp_${providerId}`]
      return provider
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a payment provider with id: ${providerId}`
      )
    }
  }
}

export default PaymentProviderService
