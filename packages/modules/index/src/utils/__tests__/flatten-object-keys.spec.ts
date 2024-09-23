import { flattenObjectKeys } from "../flatten-object-keys"

describe("flattenWhereClauses", () => {
  it("should flatten where clauses", () => {
    const where = {
      a: 1,
      b: {
        c: 2,
        d: 3,
        z: {
          $ilike: "%test%",
        },
        y: null,
      },
      e: 4,
    }

    const result = flattenObjectKeys(where)

    expect(result).toEqual({
      a: 1,
      "b.c": 2,
      "b.d": 3,
      "b.z": { $ilike: "%test%" },
      "b.y": null,
      e: 4,
    })
  })
})
