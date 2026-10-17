import { CampaignBudgetType, ComputedActions } from "@medusajs/framework/utils"
import {
  computeActionForBudgetExceeded,
  getBudgetUsageContextFromComputeActionContext,
} from "../usage"

describe("computeActionForBudgetExceeded", () => {
  it("should return undefined if promotion has no campaign budget", () => {
    const promotion: any = {
      code: "PROMO_1",
      campaign: {},
    }

    expect(computeActionForBudgetExceeded(promotion, 100)).toBeUndefined()
  })

  describe("SPEND budget type", () => {
    it("should exceed budget when used + amount > limit", () => {
      const promotion: any = {
        code: "PROMO_SPEND",
        campaign: {
          budget: {
            type: CampaignBudgetType.SPEND,
            limit: 100,
            used: 0,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 150)
      expect(result).toEqual({
        action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
        code: "PROMO_SPEND",
      })
    })

    it("should not exceed budget when used + amount <= limit", () => {
      const promotion: any = {
        code: "PROMO_SPEND",
        campaign: {
          budget: {
            type: CampaignBudgetType.SPEND,
            limit: 100,
            used: 50,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 50)
      expect(result).toBeUndefined()
    })
  })

  describe("SPEND_BY_ATTRIBUTE budget type", () => {
    it("should exceed budget when amount > limit with used=0", () => {
      const promotion: any = {
        code: "PROMO_SPEND_ATTR",
        campaign: {
          budget: {
            type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
            attribute: "customer_id",
            limit: 100,
            used: 0,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 150)
      expect(result).toEqual({
        action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
        code: "PROMO_SPEND_ATTR",
      })
    })

    it("should not exceed budget when amount <= limit with used=0", () => {
      const promotion: any = {
        code: "PROMO_SPEND_ATTR",
        campaign: {
          budget: {
            type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
            attribute: "customer_id",
            limit: 100,
            used: 0,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 100)
      expect(result).toBeUndefined()
    })

    it("should respect attributeUsage when provided", () => {
      const promotion: any = {
        code: "PROMO_SPEND_ATTR",
        campaign: {
          budget: {
            type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
            attribute: "customer_id",
            limit: 100,
            used: 0,
          },
        },
      }

      const attributeUsage: any = {
        id: "usage_1",
        budget_id: "budget_1",
        attribute_value: "cust_123",
        used: 80,
      }

      // 80 + 30 = 110 > 100 -> exceed
      const exceededResult = computeActionForBudgetExceeded(
        promotion,
        30,
        attributeUsage
      )
      expect(exceededResult).toEqual({
        action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
        code: "PROMO_SPEND_ATTR",
      })

      // 80 + 20 = 100 <= 100 -> not exceed
      const allowedResult = computeActionForBudgetExceeded(
        promotion,
        20,
        attributeUsage
      )
      expect(allowedResult).toBeUndefined()
    })
  })

  describe("USAGE budget type", () => {
    it("should exceed budget when used + 1 > limit", () => {
      const promotion: any = {
        code: "PROMO_USAGE",
        campaign: {
          budget: {
            type: CampaignBudgetType.USAGE,
            limit: 5,
            used: 5,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 1)
      expect(result).toEqual({
        action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
        code: "PROMO_USAGE",
      })
    })

    it("should not exceed budget when used + 1 <= limit", () => {
      const promotion: any = {
        code: "PROMO_USAGE",
        campaign: {
          budget: {
            type: CampaignBudgetType.USAGE,
            limit: 5,
            used: 4,
          },
        },
      }

      const result = computeActionForBudgetExceeded(promotion, 1)
      expect(result).toBeUndefined()
    })
  })

  describe("USE_BY_ATTRIBUTE budget type", () => {
    it("should return undefined if attributeUsage is not provided", () => {
      const promotion: any = {
        code: "PROMO_USE_ATTR",
        campaign: {
          budget: {
            type: CampaignBudgetType.USE_BY_ATTRIBUTE,
            attribute: "customer_id",
            limit: 1,
            used: 0,
          },
        },
      }

      expect(computeActionForBudgetExceeded(promotion, 1)).toBeUndefined()
    })

    it("should evaluate budget using attributeUsage when provided", () => {
      const promotion: any = {
        code: "PROMO_USE_ATTR",
        campaign: {
          budget: {
            type: CampaignBudgetType.USE_BY_ATTRIBUTE,
            attribute: "customer_id",
            limit: 2,
            used: 0,
          },
        },
      }

      const attributeUsage: any = {
        id: "usage_1",
        budget_id: "budget_1",
        attribute_value: "cust_123",
        used: 2,
      }

      const result = computeActionForBudgetExceeded(
        promotion,
        1,
        attributeUsage
      )
      expect(result).toEqual({
        action: ComputedActions.CAMPAIGN_BUDGET_EXCEEDED,
        code: "PROMO_USE_ATTR",
      })
    })
  })
})

describe("getBudgetUsageContextFromComputeActionContext", () => {
  it("should extract customer_id and customer_email correctly", () => {
    const context: any = {
      customer_id: "cust_1",
      email: "test@example.com",
    }

    expect(getBudgetUsageContextFromComputeActionContext(context)).toEqual({
      customer_id: "cust_1",
      customer_email: "test@example.com",
    })
  })

  it("should fallback to customer.id if customer_id not present directly", () => {
    const context: any = {
      customer: { id: "cust_fallback" },
      email: "fallback@example.com",
    }

    expect(getBudgetUsageContextFromComputeActionContext(context)).toEqual({
      customer_id: "cust_fallback",
      customer_email: "fallback@example.com",
    })
  })
})
