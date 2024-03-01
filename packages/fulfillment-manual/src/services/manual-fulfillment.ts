import { AbstractFulfillmentProviderService } from "@medusajs/utils"

// TODO rework type and DTO's

export class ManualFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "manual"

  constructor() {
    super()
  }

  async getFulfillmentOptions(): Promise<Record<string, unknown>[]> {
    return [
      {
        id: "manual-fulfillment",
      },
      {
        id: "manual-fulfillment-return",
        is_return: true,
      },
    ]
  }

  async validateFulfillmentData(_, data, context): Promise<any> {
    return data
  }

  async validateOption(data): Promise<boolean> {
    return true
  }

  // TODO revisit this API

  /*canCalculate() {
    return false
  }

  calculatePrice() {
    throw Error("Manual Fulfillment service cannot calculatePrice")
  }*/

  async createFulfillment(): Promise<any> {
    // No data is being sent anywhere
    return {}
  }

  async cancelFulfillment(): Promise<any> {
    return {}
  }
}

export default ManualFulfillmentService
