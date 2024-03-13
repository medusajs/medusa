import { BigNumber } from "../big-number"
import { transformPropertiesToBigNumber } from "../transform-properties-to-bignumber"

describe("Transfor Properties to BigNumber", function () {
  it("should transform all properties containing matching prefix _raw to BigNumber", function () {
    const obj = {
      price: 42,
      raw_price: {
        value: "42",
        precision: 10,
      },
      field: 111,
      metadata: {
        numeric_field: 100,
        raw_numeric_field: {
          value: "100",
        },
        random_field: 134,
      },

      abc: null,
      raw_abc: {
        value: "9.00000010000103991234",
        precision: 20,
      },
    }

    transformPropertiesToBigNumber(obj)

    const price = obj.price as unknown as BigNumber
    expect(price).toBeInstanceOf(BigNumber)
    expect(price.numeric).toEqual(42)
    expect(price.raw).toEqual({
      value: "42",
      precision: 10,
    })

    expect(obj.field).toBe(111)

    const metaNum = obj.metadata.numeric_field as unknown as BigNumber
    expect(metaNum).toBeInstanceOf(BigNumber)
    expect(metaNum.numeric).toEqual(100)
    expect(metaNum.raw).toEqual({
      value: "100",
      precision: 20,
    })
    expect(obj.metadata.random_field).toBe(134)

    const abc = obj.abc as unknown as BigNumber
    expect(abc).toBeInstanceOf(BigNumber)
    expect(abc.numeric).toEqual(9.00000010000104)
    expect(abc.raw).toEqual({
      value: "9.00000010000103991234",
      precision: 20,
    })
  })

  it("should transform all properties on the option 'include' to BigNumber", function () {
    const obj = {
      price: 42,
      raw_price: {
        value: "42",
        precision: 10,
      },
      field: 111,
      metadata: {
        random_field: 134,
      },
    }

    transformPropertiesToBigNumber(obj, {
      include: ["metadata.random_field"],
    })

    expect(obj.price).toBeInstanceOf(BigNumber)

    const price = obj.price as unknown as BigNumber
    expect(price.numeric).toEqual(42)
    expect(price.raw).toEqual({
      value: "42",
      precision: 10,
    })

    expect(obj.field).toBe(111)

    const metaNum = obj.metadata.random_field as unknown as BigNumber
    expect(metaNum).toBeInstanceOf(BigNumber)
    expect(metaNum.numeric).toEqual(134)
    expect(metaNum.raw).toEqual({
      value: "134.00000000000000000",
      precision: 20,
    })
  })

  it("should transform all properties containing matching prefix _raw to BigNumber excluding selected ones", function () {
    const obj = {
      price: 42,
      raw_price: {
        value: "42",
        precision: 10,
      },
      metadata: {
        numeric_field: 100,
        raw_numeric_field: {
          value: "100",
        },
      },

      abc: null,
      raw_abc: {
        value: "9.00000010000103991234",
        precision: 20,
      },
    }

    transformPropertiesToBigNumber(obj, {
      exclude: ["abc", "metadata.numeric_field"],
    })

    const price = obj.price as unknown as BigNumber
    expect(obj.price).toBeInstanceOf(BigNumber)
    expect(price.numeric).toEqual(42)
    expect(price.raw).toEqual({
      value: "42",
      precision: 10,
    })

    expect(obj.abc).toEqual(null)
  })
})
