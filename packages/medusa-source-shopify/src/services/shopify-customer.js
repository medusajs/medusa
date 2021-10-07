import { BaseService } from "medusa-interfaces"

class ShopifyCustomerService extends BaseService {
  constructor({ manager, customerService }, options) {
    super()

    this.options = options

    /** @private @const {EntityManager} */
    this.manager_ = manager
    /** @private @const {CustomerService} */
    this.customerService_ = customerService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShopifyCustomerService({
      manager: transactionManager,
      options: this.options,
      customerService: this.customerService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Creates a new customer
   * @param {object} customer
   * @param {object} shippingAddress
   * @param {object} billingAddress
   * @returns
   */
  async create(data) {
    return this.atomicPhase_(async (manager) => {
      const { customer, shipping_address, billing_address } = data

      const existingCustomer = await this.customerService_
        .retrieveByEmail(customer.email)
        .catch((_err) => undefined)

      if (existingCustomer) {
        return existingCustomer
      }

      const normalizedCustomer = this.normalizeCustomer_(
        customer,
        shipping_address,
        billing_address
      )
      let normalizedBilling = normalizedCustomer.billing_address
      let normalizedShipping = normalizedCustomer.shipping_address

      delete normalizedCustomer.billing_address
      delete normalizedCustomer.shipping_address

      const medusaCustomer = await this.customerService_
        .withTransaction(manager)
        .create(normalizedCustomer)

      await this.customerService_
        .withTransaction(manager)
        .addAddress(medusaCustomer.id, normalizedShipping)
        .catch((e) =>
          console.log(
            "Failed on creating shipping address",
            e,
            normalizedShipping
          )
        )

      const result = await this.customerService_
        .withTransaction(manager)
        .update(medusaCustomer.id, {
          billing_address: normalizedBilling,
        })
        .catch((e) =>
          console.log(
            "Failed on creating billing address",
            e,
            normalizedBilling
          )
        )

      return result
    })
  }

  normalizeAddress_(shopifyAddress) {
    return {
      first_name: shopifyAddress.first_name,
      last_name: shopifyAddress.last_name,
      phone: shopifyAddress.phone,
      company: shopifyAddress.company,
      address_1: shopifyAddress.address1,
      address_2: shopifyAddress.address2,
      city: shopifyAddress.city,
      postal_code: shopifyAddress.zip,
      country_code: shopifyAddress.country_code.toLowerCase(),
      province: shopifyAddress.province_code,
    }
  }

  normalizeCustomer_(shopifyCustomer, shippingAddress, billingAddress) {
    return {
      first_name: shopifyCustomer.first_name,
      last_name: shopifyCustomer.last_name,
      email: shopifyCustomer.email,
      phone: shopifyCustomer.phone,
      shipping_address: this.normalizeAddress_(shippingAddress),
      billing_address: this.normalizeAddress_(billingAddress),
      metadata: {
        sh_id: shopifyCustomer.id,
      },
    }
  }
}

export default ShopifyCustomerService
