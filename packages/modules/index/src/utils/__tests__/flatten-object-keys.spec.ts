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

  it("should preserve non-plain object values", () => {
    const date = new Date("2024-01-01T00:00:00.000Z")
    const where = {
      created_at: date,
      nested: {
        updated_at: date,
      },
    }

    const result = flattenObjectKeys(where)

    expect(result).toEqual({
      created_at: date,
      "nested.updated_at": date,
    })
  })
})
