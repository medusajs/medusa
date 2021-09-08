import { FulfillmentService } from "medusa-interfaces"

class EsynergiFulfillmentService extends FulfillmentService {
  static identifier = "esynergi"

  constructor({ logger, claimService, swapService, orderService }, options) {
    super()

    this.options_ = options

    if (!options.coo_countries) {
      this.options_.coo_countries = ["all"]
    } else if (Array.isArray(options.coo_countries)) {
      this.options_.coo_countries = options.coo_countries.map((c) =>
        c.toLowerCase()
      )
    } else if (typeof options.coo_countries === "string") {
      this.options_.coo_countries = [options.coo_countries]
    }

    /** @private @const {logger} */
    this.logger_ = logger

    /** @private @const {OrderService} */
    this.orderService_ = orderService

    /** @private @const {SwapService} */
    this.swapService_ = swapService

    /** @private @const {SwapService} */
    this.claimService_ = claimService

    /** @private @const {AxiosClient} */
    // this.client_ =
  }

  registerInvoiceGenerator(service) {
    if (typeof service.createInvoice === "function") {
      this.invoiceGenerator_ = service
    }
  }

  // should return array of `shipping_option.data`
  async getFulfillmentOptions() {
    // Fulfillment options from E-synergi: https://wms.e-synergi.dk/api-ext-v1/shipping-service
    // return data.items
    // TODO: Potentially hardcode parcel shops
    //    Look Webshipper plugin -> includes `require_drop_point`
    //    if service_code === `ShopDeliveryService`
  }

  canCalculate() {
    // Return whether or not we are able to calculate dynamically
    return false
  }

  calculatePrice() {
    // Calculate prices
  }

  /**
   * Creates a return shipment in webshipper using the given method data, and
   * return lines.
   */
  async createReturn(returnOrder) {}

  async getReturnDocuments(data) {}

  async createFulfillment(
    methodData,
    fulfillmentItems,
    fromOrder,
    fulfillment
  ) {
    // create order in esynergi
    // https://wms.e-synergi.dk/docs/v1#tag/Order/paths/~1order~1create/post
  }

  /**
   * This plugin doesn't support shipment documents.
   */
  async retrieveDocuments(fulfillmentData, documentType) {}

  /**
   * Retrieves the documents associated with an order.
   * @return {Promise<Array<_>>} an array of document objects to store in the
   *   database.
   */
  async getFulfillmentDocuments(data) {}

  async retrieveDropPoints(id, zip, countryCode, address1) {}

  /**
   * Cancels a fulfillment. If the fulfillment has already been canceled this
   * is idemptotent. Can only cancel pending orders.
   * @param {object} data - the fulfilment data
   * @return {Promise<object>} the result of the cancellation
   */
  async cancelFulfillment(data) {}
}

export default EsynergiFulfillmentService
