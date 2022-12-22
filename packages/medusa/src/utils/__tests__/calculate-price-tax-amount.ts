import { calculatePriceTaxAmount } from "../calculate-price-tax-amount"
import { FlagRouter } from "../../utils/flag-router"

describe("calculatePriceTaxAmount", () => {
  describe("Calculate taxes from a given price", () => {
    beforeAll(() => {
      jest.spyOn(FlagRouter.prototype, "isFeatureEnabled").mockReturnValue(true)
    })

    it("Tax NOT included", () => {
      const tax = calculatePriceTaxAmount({
        price: 150,
        taxRate: 0.19,
        includesTax: false,
      })

      expect(tax).toBeCloseTo(28.5, 2)

      const tax2 = calculatePriceTaxAmount({
        price: 120,
        taxRate: 0.17,
      })

      expect(tax2).toBeCloseTo(20.4, 2)
    })

    it("Tax included", () => {
      const tax = calculatePriceTaxAmount({
        price: 115,
        taxRate: 0.15,
        includesTax: true,
      })

      expect(tax).toBeCloseTo(15, 2)

      const tax2 = calculatePriceTaxAmount({
        price: 2150,
        taxRate: 0.17,
        includesTax: true,
      })

      expect(tax2).toBeCloseTo(312.39, 2)
    })
  })
})
