import { MathBN } from "../math"

describe("MathBN", () => {
  describe("convert", () => {
    it("rounds to the requested decimal places", () => {
      expect(MathBN.convert(1.234, 2).toString()).toEqual("1.23")
    })

    it("rounds to 0 decimal places when decimalPlaces is 0", () => {
      expect(MathBN.convert(1.9, 0).toString()).toEqual("2")
      expect(MathBN.convert(1.4, 0).toString()).toEqual("1")
    })

    it("does not round when decimalPlaces is omitted", () => {
      expect(MathBN.convert(1.234).toString()).toEqual("1.234")
    })

    it("converts objects from another BigNumber copy through toString", () => {
      const foreignBigNumber = {
        raw: { value: "2.5", precision: 20 },
        toString() {
          return this.raw.value
        },
      }

      expect(MathBN.convert(foreignBigNumber as any).toString()).toEqual(
        "2.5"
      )
    })
  })
})
