import { CampaignBudgetType } from "@medusajs/framework/utils"
import { AdminCreateCampaign } from "../validators"

describe("AdminCreateCampaign validators", () => {
  it("accepts spend_by_attribute with currency_code and attribute", () => {
    const data = {
      name: "Campaign 1",
      campaign_identifier: "camp-1",
      budget: {
        type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
        currency_code: "usd",
        attribute: "customer_id",
        limit: 100,
      },
    }

    const result = AdminCreateCampaign().safeParse(data)
    expect(result.success).toBe(true)
  })

  it("rejects spend_by_attribute without currency_code", () => {
    const data = {
      name: "Campaign 1",
      campaign_identifier: "camp-1",
      budget: {
        type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
        attribute: "customer_id",
        limit: 100,
      },
    }

    const result = AdminCreateCampaign().safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "currency_code is required"
      )
    }
  })

  it("rejects spend_by_attribute without attribute", () => {
    const data = {
      name: "Campaign 1",
      campaign_identifier: "camp-1",
      budget: {
        type: CampaignBudgetType.SPEND_BY_ATTRIBUTE,
        currency_code: "usd",
        limit: 100,
      },
    }

    const result = AdminCreateCampaign().safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "campaign budget attribute is required"
      )
    }
  })

  it("rejects use_by_attribute with currency_code", () => {
    const data = {
      name: "Campaign 1",
      campaign_identifier: "camp-1",
      budget: {
        type: CampaignBudgetType.USE_BY_ATTRIBUTE,
        attribute: "customer_id",
        currency_code: "usd",
        limit: 2,
      },
    }

    const result = AdminCreateCampaign().safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        "currency_code should not be present"
      )
    }
  })
})
