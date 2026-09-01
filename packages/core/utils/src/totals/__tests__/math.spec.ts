import { MathBN } from "../math"

describe("MathBN", function () {
  describe("convert", function () {
    it("does not round when decimalPlaces is omitted", function () {
      expect(MathBN.convert(1.567).toString()).toEqual("1.567")
    })

    it("rounds to the given number of decimal places", function () {
      expect(MathBN.convert(1.567, 2).toString()).toEqual("1.57")
    })

    it("rounds to a whole number when decimalPlaces is 0", function () {
      // decimalPlaces: 0 is a valid value (e.g. zero-decimal currencies such as
      // JPY) and must round rather than being ignored as "no rounding".
      expect(MathBN.convert(1.567, 0).toString()).toEqual("2")
      expect(MathBN.convert(1.4, 0).toString()).toEqual("1")
    })
  })
})
