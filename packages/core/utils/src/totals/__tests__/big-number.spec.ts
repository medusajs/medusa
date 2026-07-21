import { BigNumber as BN } from "bignumber.js"
import { BigNumber } from "../big-number"

describe("BigNumber", function () {
  describe("constructor", function () {
    it("should set and return number", function () {
      const number = new BigNumber(42)
      expect(JSON.stringify(number)).toEqual(JSON.stringify(42))
    })

    it("should set BigNumber and return number", function () {
      const number = new BigNumber({
        value: "42",
      })
      expect(JSON.stringify(number)).toEqual(JSON.stringify(42))
    })

    it("should set string and return number", function () {
      const number = new BigNumber("42")
      expect(JSON.stringify(number)).toEqual(JSON.stringify(42))
    })

    it("should set bignumber.js and return number", function () {
      const bn = new BN("42")
      const number = new BigNumber(bn)
      expect(JSON.stringify(number)).toEqual(JSON.stringify(42))
    })

    it("should throw if not correct type", function () {
      // @ts-ignore
      expect(() => new BigNumber([])).toThrow(
        "Invalid BigNumber value: . Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"
      )

      expect(() => new BigNumber(null as any)).toThrow(
        "Invalid BigNumber value: null. Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"
      )

      expect(() => new BigNumber(undefined as any)).toThrow(
        "Invalid BigNumber value: undefined. Should be one of: string, number, BigNumber (bignumber.js), BigNumberRawValue"
      )
    })
  })

  describe("toString", function () {
    it("returns a numeric string instead of '[object Object]'", function () {
      const number = new BigNumber("10.99")
      expect(number.toString()).toEqual("10.990000000000000000")
      expect(parseFloat(number.toString())).toEqual(10.99)
    })

    it("is consistent with the [Symbol.toPrimitive] string hint", function () {
      const number = new BigNumber("1234.5678")
      expect(number.toString()).toEqual(String(number))
      expect(number.toString()).toEqual(`${number}`)
    })

    it("round-trips through parseFloat for whole and zero values", function () {
      expect(parseFloat(new BigNumber(42).toString())).toEqual(42)
      expect(parseFloat(new BigNumber(0).toString())).toEqual(0)
    })
  })
})
