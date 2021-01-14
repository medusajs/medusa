import { MedusaError } from "medusa-core-utils"

/**
 * Helps retrive fulfillment providers
 */
class FulfillmentProviderService {
  constructor(container) {
    /** @private {logger} */
    this.container_ = container
  }

  async registerInstalledProviders(providers) {
    const { manager, fulfillmentProviderRepository } = this.container_
    const model = manager.getCustomRepository(fulfillmentProviderRepository)
    model.update({}, { is_installed: false })
    for (const p of providers) {
      const n = model.create({ id: p, is_installed: true })
      await model.save(n)
    }
  }

  async list() {
    const { manager, fulfillmentProviderRepository } = this.container_
    const fpRepo = manager.getCustomRepository(fulfillmentProviderRepository)

    return fpRepo.find({})
  }

  async listFulfillmentOptions(providers) {
    const result = await Promise.all(
      providers.map(async p => {
        const provider = await this.retrieveProvider(p)
        return {
          provider_id: p,
          options: await provider.getFulfillmentOptions(),
        }
      })
    )

    return result
  }

  /**
   * @returns {FulfillmentService} the payment fulfillment provider
   */
  retrieveProvider(provider_id) {
    try {
      return this.container_[`fp_${provider_id}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${provider_id}`
      )
    }
  }

  async createFulfillment(method, items, order, fulfillment) {
    const provider = this.retrieveProvider(method.shipping_option.provider_id)
    return provider.createFulfillment(method.data, items, order, fulfillment)
  }

  async canCalculate(option) {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.canCalculate(option.data)
  }

  async validateFulfillmentData(option, data, cart) {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.validateFulfillmentData(option.data, data, cart)
  }

  async cancelFulfillment(fulfillment) {
    const provider = this.retrieveProvider(fulfillment.provider_id)
    return provider.cancelFulfillment(fulfillment.data)
  }

  async calculatePrice(option, data, cart) {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.calculatePrice(option.data, data, cart)
  }

  async validateOption(option) {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.validateOption(option.data)
  }

  async createReturn(returnOrder) {
    const option = returnOrder.shipping_method.shipping_option
    const provider = this.retrieveProvider(option.provider_id)
    return provider.createReturn(returnOrder)
  }
}

export default FulfillmentProviderService
