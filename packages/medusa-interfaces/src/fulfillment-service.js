import BaseService from "./base-service"

/**
 * The interface that all fulfillment services must inherit from. The intercace
 * provides the necessary methods for creating, authorizing and managing
 * fulfillment orders.
 * @interface
 */
class BaseFulfillmentService extends BaseService {
  constructor() {
    super()
  }

  getIdentifier() {
    return this.constructor.identifier
  }

  /**
   * Called before a shipping option is created in Admin. The method should
   * return all of the options that the fulfillment provider can be used with,
   * and it is here the distinction between different shipping options are
   * enforced. For example, a fulfillment provider may offer Standard Shipping
   * and Express Shipping as fulfillment options, it is up to the store operator
   * to create shipping options in Medusa that can be chosen between by the
   * customer.
   */
  getFulfillmentOptions() {
    throw Error("getFulfillmentOptions must be overridden by the child class")
  }

  /**
   * Called before a shipping method is set on a cart to ensure that the data
   * sent with the shipping method is valid. The data object may contain extra
   * data about the shipment such as an id of a drop point. It is up to the
   * fulfillment provider to enforce that the correct data is being sent
   * through.
   * @param {object} optionData - the data to validate
   * @param {object} data - the data to validate
   * @param {object | undefined} cart - the cart to which the shipping method will be applied
   * @return {object} the data to populate `cart.shipping_methods.$.data` this
   *    is usually important for future actions like generating shipping labels
   */
  validateFulfillmentData(optionData, data, cart) {
    throw Error("validateFulfillmentData must be overridden by the child class")
  }

  /**
   * Called before a shipping option is created in Admin. Use this to ensure
   * that a fulfillment option does in fact exist.
   */
  validateOption(data) {
    throw Error("validateOption must be overridden by the child class")
  }

  canCalculate(data) {
    throw Error("canCalculate must be overridden by the child class")
  }

  /**
   * Used to calculate a price for a given shipping option.
   */
  calculatePrice(optionData, data, cart) {
    throw Error("calculatePrice must be overridden by the child class")
  }

  createFulfillment(data, items, order, fulfillment) {
    throw Error("createFulfillment must be overridden by the child class")
  }

  cancelFulfillment(fulfillment) {
    throw Error("cancelFulfillment must be overridden by the child class")
  }

  /**
   * Used to retrieve documents associated with a fulfillment.
   * Will default to returning no documents.
   */
  getFulfillmentDocuments(data) {
    return []
  }

  /**
   * Used to create a return order. Should return the data necessary for future
   * operations on the return; in particular the data may be used to receive
   * documents attached to the return.
   */
  createReturn(fromData) {
    throw Error("createReturn must be overridden by the child class")
  }

  /**
   * Used to retrieve documents related to a return order.
   */
  getReturnDocuments(data) {
    return []
  }

  /**
   * Used to retrieve documents related to a shipment.
   */
  getShipmentDocuments(data) {
    return []
  }

  retrieveDocuments(fulfillmentData, documentType) { 
    throw Error("retrieveDocuments must be overridden by the child class")
  }
}

export default BaseFulfillmentService
