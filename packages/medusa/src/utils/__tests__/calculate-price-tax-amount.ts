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

      expect(tax).toEqual(28.5)

      const tax2 = Math.round(
        calculatePriceTaxAmount({
          price: 120,
          taxRate: 0.17,
        })
      )

      expect(tax2).toEqual(20)
    })

    it("Tax included", () => {
      const tax = calculatePriceTaxAmount({
        price: 115,
        taxRate: 0.15,
        includesTax: true,
      }).toFixed(2)

      expect(tax).toEqual("15.00")

      const tax2 = calculatePriceTaxAmount({
        price: 2150,
        taxRate: 0.17,
        includesTax: true,
      }).toFixed(2)

      expect(tax2).toEqual("312.39")
    })
  })
})
