import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"

export class ManualFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "manual-calculated"

  constructor() {
    super()
  }

  async getFulfillmentOptions() {
    return [
      {
        id: "manual-fulfillment-calculated",
      },
      {
        id: "manual-fulfillment-return-calculated",
        is_return: true,
      },
    ]
  }

  async validateFulfillmentData(optionData, data, context) {
    return data
  }

  async calculatePrice(optionData, data, context) {
    // mock caluclation as 1.5 per item, converted with a per-currency rate to
    // assert the currency is part of the context in every calculation path
    const rate = context.currency_code === "dkk" ? 2 : 1

    return {
      calculated_amount:
        context.items.reduce((acc, i) => acc + i.quantity, 0) * 1.5 * rate,
      is_calculated_price_tax_inclusive: false,
    }
  }

  async canCalculate() {
    return true
  }

  async validateOption(data) {
    return true
  }

  async createFulfillment() {
    // No data is being sent anywhere
    return {
      data: {},
      labels: [],
    }
  }

  async cancelFulfillment() {
    return {}
  }

  async createReturnFulfillment() {
    return { data: {}, labels: [] }
  }
}
