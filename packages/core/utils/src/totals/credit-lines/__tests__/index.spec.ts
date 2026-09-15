import { calculateCreditLinesTotal } from "../index"

describe("calculateCreditLinesTotal", function () {
  it("keeps a net negative credit line total", function () {
    const result = calculateCreditLinesTotal({
      creditLines: [{ amount: 100 }, { amount: -206 }],
      currencyCode: "usd",
    })

    expect(Number(result.creditLinesTotal)).toEqual(-106)
    expect(Number(result.creditLinesSubtotal)).toEqual(-106)
  })

  it("keeps a net positive credit line total", function () {
    const result = calculateCreditLinesTotal({
      creditLines: [{ amount: 40 }],
      currencyCode: "usd",
    })

    expect(Number(result.creditLinesTotal)).toEqual(40)
    expect(Number(result.creditLinesSubtotal)).toEqual(40)
  })

  it("rounds a residue smaller than the currency epsilon to zero on either sign", function () {
    const positive = calculateCreditLinesTotal({
      creditLines: [{ amount: 0.001 }],
      currencyCode: "usd",
    })
    const negative = calculateCreditLinesTotal({
      creditLines: [{ amount: -0.001 }],
      currencyCode: "usd",
    })

    expect(Number(positive.creditLinesTotal)).toEqual(0)
    expect(Number(positive.creditLinesSubtotal)).toEqual(0)
    expect(Number(negative.creditLinesTotal)).toEqual(0)
    expect(Number(negative.creditLinesSubtotal)).toEqual(0)
  })
})
