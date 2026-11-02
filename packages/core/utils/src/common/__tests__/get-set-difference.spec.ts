import { getSetDifference } from "../get-set-difference"

describe("getSetDifference", function () {
  it("should return the elements of the original set missing from the compare set", function () {
    const res = getSetDifference(new Set([1, 2, 3]), new Set([2]))

    expect([...res]).toEqual([1, 3])
  })

  it("should skip undefined elements", function () {
    const res = getSetDifference(new Set([1, undefined, 3]), new Set([3]))

    expect([...res]).toEqual([1])
  })
})
