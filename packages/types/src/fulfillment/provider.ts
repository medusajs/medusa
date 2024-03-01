export interface IFulfillmentProvider {
  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the fulfillment plugin provider
   */
  getIdentifier(): string
  /**
   * @ignore
   *
   * Return the available fulfillment options for the given data.
   */
  getFulfillmentOptions(): Promise<Record<string, unknown>[]>
  /**
   * @ignore
   *
   * Validate the given fulfillment data.
   */
  validateFulfillmentData(optionData: any, data: any, cart: any): Promise<any>
  /**
   * @ignore
   *
   * Validate the given option.
   */
  validateOption(data: any): Promise<boolean>
  /**
   * @ignore
   *
   * Check if the provider can calculate the fulfillment price.
   */
  canCalculate(data: any): Promise<any>
  /**
   * @ignore
   *
   * Calculate the price for the given fulfillment option.
   */
  calculatePrice(optionData: any, data: any, cart: any): Promise<any>
  /**
   * @ignore
   *
   * Create a fulfillment for the given data.
   */
  createFulfillment(
    data: any,
    items: any,
    order: any,
    fulfillment: any
  ): Promise<any>
  /**
   * @ignore
   *
   * Cancel the given fulfillment.
   */
  cancelFulfillment(fulfillment: any): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given fulfillment data.
   */
  getFulfillmentDocuments(data: any): Promise<any>
  /**
   * @ignore
   *
   * Create an order for the given data.
   */
  createOrder(fromData: any): Promise<any>
  /**
   * @ignore
   *
   * Create a return for the given data.
   */
  createReturn(fromData: any): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given return data.
   */
  retrieveDocuments(fulfillmentData, documentType): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given return data.
   */
  getReturnDocuments(data: any): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given shipment data.
   */
  getShipmentDocuments(data: any): Promise<any>
}
