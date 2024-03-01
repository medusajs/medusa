import { IFulfillmentProvider } from "@medusajs/types"

export class AbstractFulfillmentProviderService
  implements IFulfillmentProvider
{
  static identifier: string

  static _isFulfillmentService = true

  static isFulfillmentService(obj) {
    return obj?.constructor?._isFulfillmentService
  }

  getIdentifier() {
    return (this.constructor as any).identifier
  }

  async getFulfillmentOptions(): Promise<Record<string, unknown>> {
    throw Error("getFulfillmentOptions must be overridden by the child class")
  }

  async validateFulfillmentData(optionData, data, cart) {
    throw Error("validateFulfillmentData must be overridden by the child class")
  }

  async validateOption(data) {
    throw Error("validateOption must be overridden by the child class")
  }

  async canCalculate(data) {
    throw Error("canCalculate must be overridden by the child class")
  }

  async calculatePrice(optionData, data, cart) {
    throw Error("calculatePrice must be overridden by the child class")
  }

  async createFulfillment(data, items, order, fulfillment) {
    throw Error("createFulfillment must be overridden by the child class")
  }

  async cancelFulfillment(fulfillment) {
    throw Error("cancelFulfillment must be overridden by the child class")
  }

  async getFulfillmentDocuments(data) {
    return []
  }

  async createReturn(fromData) {
    throw Error("createReturn must be overridden by the child class")
  }

  async getReturnDocuments(data) {
    return []
  }

  async getShipmentDocuments(data) {
    return []
  }

  async retrieveDocuments(fulfillmentData, documentType) {
    throw Error("retrieveDocuments must be overridden by the child class")
  }
}
