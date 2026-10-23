import { parseStringifyIfNecessary } from "../parse-stringify-if-necessary"

describe("parseStringifyIfNecessary", () => {
  it("should deep copy plain objects and drop non-serializable values", () => {
    const nested = { b: 2 }
    const input = { a: 1, nested, fn: () => {}, undef: undefined }

    const result = parseStringifyIfNecessary(input)

    expect(result).toEqual({ a: 1, nested: { b: 2 } })
    expect(result.nested).not.toBe(nested)
  })

  it("should copy objects with a null prototype", () => {
    const input = Object.create(null)
    input.a = 1

    expect(parseStringifyIfNecessary(input)).toEqual({ a: 1 })
    expect(parseStringifyIfNecessary(Object.create(null))).toEqual({})
  })

  it("should copy objects that have a hasOwnProperty key", () => {
    const input = JSON.parse('{"hasOwnProperty":"x","a":1}')

    expect(parseStringifyIfNecessary(input)).toEqual({
      hasOwnProperty: "x",
      a: 1,
    })
    expect(
      parseStringifyIfNecessary({ nested: { hasOwnProperty: 1, b: 2 } })
    ).toEqual({ nested: { hasOwnProperty: 1, b: 2 } })
  })
})
