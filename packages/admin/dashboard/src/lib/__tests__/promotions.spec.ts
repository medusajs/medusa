import { HttpTypes } from "@medusajs/types"
import i18next from "i18next"
import { describe, expect, it } from "vitest"

// promotionStatusMap resolves its labels through i18n.t at module load, so
// i18next has to be initialized before the module under test is imported.
await i18next.init({ lng: "en", fallbackLng: "en", resources: {} })

const { getPromotionStatus, promotionStatusMap, PromotionStatus } =
  await import("../promotions")

const buildPromotion = (
  campaign: Partial<HttpTypes.AdminCampaign>
): HttpTypes.AdminPromotion =>
  ({
    status: "active",
    campaign: {
      starts_at: null,
      ends_at: null,
      ...campaign,
    },
  } as HttpTypes.AdminPromotion)

describe("getPromotionStatus", () => {
  it("should not mark a promotion as expired when a use_by_attribute budget's aggregate usage exceeds the per-attribute limit", () => {
    const promotion = buildPromotion({
      budget: {
        type: "use_by_attribute",
        limit: 1,
        used: 5,
      } as HttpTypes.AdminCampaign["budget"],
    })

    expect(getPromotionStatus(promotion)).toEqual(
      promotionStatusMap[PromotionStatus.ACTIVE]
    )
  })

  it("should not mark a promotion as expired when a spend_by_attribute budget's aggregate usage exceeds the per-attribute limit", () => {
    const promotion = buildPromotion({
      budget: {
        type: "spend_by_attribute",
        limit: 100,
        used: 500,
      } as HttpTypes.AdminCampaign["budget"],
    })

    expect(getPromotionStatus(promotion)).toEqual(
      promotionStatusMap[PromotionStatus.ACTIVE]
    )
  })

  it("should mark a promotion as expired when a global budget is exceeded", () => {
    const promotion = buildPromotion({
      budget: {
        type: "usage",
        limit: 1,
        used: 5,
      } as HttpTypes.AdminCampaign["budget"],
    })

    expect(getPromotionStatus(promotion)).toEqual(
      promotionStatusMap[PromotionStatus.EXPIRED]
    )
  })

  it("should mark a promotion as expired when its campaign has ended, regardless of budget type", () => {
    const promotion = buildPromotion({
      ends_at: "2020-01-01T00:00:00.000Z",
      budget: {
        type: "use_by_attribute",
        limit: 1,
        used: 0,
      } as HttpTypes.AdminCampaign["budget"],
    })

    expect(getPromotionStatus(promotion)).toEqual(
      promotionStatusMap[PromotionStatus.EXPIRED]
    )
  })
})
