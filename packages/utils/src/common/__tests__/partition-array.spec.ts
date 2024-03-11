import { partitionArray } from "../../../dist"

describe("partitionArray", function () {
  it("should split array according to predicate", function () {
    const res = partitionArray([1, 2, 3, 4, 5], (x) => x % 2 === 0)

    expect(res).toEqual([
      [2, 4],
      [1, 3, 5],
    ])
  })
})
