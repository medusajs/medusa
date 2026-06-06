import { AbstractFulfillmentProviderService } from "@zjedene-medusa/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CreateFulfillmentResult,
  FulfillmentOption,
  ValidateFulfillmentDataContext,
} from "@zjedene-medusa/types"

// TODO rework type and DTO's

export class ManualFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "manual"

  constructor() {
    super()
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
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

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<any> {
    return data
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    throw new Error("Manual fulfillment does not support price calculation")
  }

  async canCalculate(): Promise<boolean> {
    return false
  }

  async validateOption(data: Record<string, any>): Promise<boolean> {
    return true
  }

  async createFulfillment(): Promise<CreateFulfillmentResult> {
    // No data is being sent anywhere
    return {
      data: {},
      labels: [],
    }
  }

  async cancelFulfillment(): Promise<any> {
    return {}
  }

  async createReturnFulfillment(): Promise<CreateFulfillmentResult> {
    return {
      data: {},
      labels: [],
    }
  }
}
