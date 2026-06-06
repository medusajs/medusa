import { AbstractFulfillmentProviderService } from "@zjedene-medusa/framework/utils"

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
    if (context.exchange_id) {
      return {
        calculated_amount:
          context.exchange_items.reduce((acc, i) => acc + i.quantity, 0) * 2.5, // mock return cost as 2 per item
        is_calculated_price_tax_inclusive: false,
      }
    }
    if (context.claim_id) {
      return {
        calculated_amount:
          context.claim_items.reduce((acc, i) => acc + i.quantity, 0) * 2.5, // mock return cost as 2 per item
        is_calculated_price_tax_inclusive: false,
      }
    }

    if (context.return_id) {
      return {
        calculated_amount:
          context.return_items.reduce((acc, i) => acc + i.quantity, 0) * 2, // mock return cost as 2 per item
        is_calculated_price_tax_inclusive: false,
      }
    }

    return {
      calculated_amount:
        context.items.reduce((acc, i) => acc + i.quantity, 0) * 1.5, // mock caluclation as 1.5 per item
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
