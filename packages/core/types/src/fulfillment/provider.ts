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
  validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any>
  /**
   * @ignore
   *
   * Validate the given option.
   */
  validateOption(data: Record<string, unknown>): Promise<boolean>
  /**
   * @ignore
   *
   * Check if the provider can calculate the fulfillment price.
   */
  canCalculate(data: Record<string, unknown>): Promise<any>
  /**
   * @ignore
   *
   * Calculate the price for the given fulfillment option.
   */
  calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any>
  /**
   * @ignore
   *
   * Create a fulfillment for the given data.
   */
  createFulfillment(
    data: object,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>>
  /**
   * @ignore
   *
   * Cancel the given fulfillment.
   */
  cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given fulfillment data.
   */
  getFulfillmentDocuments(data: Record<string, unknown>): Promise<any>
  /**
   * @ignore
   *
   * Create a return for the given data.
   */
  createReturnFulfillment(fromData: Record<string, unknown>): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given return data.
   */
  retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: string
  ): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given return data.
   */
  getReturnDocuments(data: Record<string, unknown>): Promise<any>
  /**
   * @ignore
   *
   * Get the documents for the given shipment data.
   */
  getShipmentDocuments(data: Record<string, unknown>): Promise<any>
}
