import { fromMinorUnits, toMinorUnits } from "../amounts"

describe("toMinorUnits", () => {
  it.each([
    [10, "usd", 1000],
    [10.005, "eur", 1001],
    [1000, "JPY", 1000],
    [1000, "idr", 1000],
    [10, "clp", 1000],
    [1.234, "kwd", 1234],
  ])("converts %s %s to %s", (amount, currency, expected) => {
    expect(toMinorUnits(amount, currency)).toEqual(expected)
  })
})

describe("fromMinorUnits", () => {
  it.each([
    [1000, "usd", 10],
    [1000, "JPY", 1000],
    [1234, "kwd", 1.234],
  ])("converts %s %s to %s", (amount, currency, expected) => {
    expect(fromMinorUnits(amount, currency)).toEqual(expected)
  })
})
