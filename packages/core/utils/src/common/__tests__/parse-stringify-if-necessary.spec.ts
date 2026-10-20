import { parseStringifyIfNecessary } from "../parse-stringify-if-necessary"

describe("parseStringifyIfNecessary", function () {
  it("should copy a plain object and drop functions and undefined values", function () {
    const input = {
      a: 1,
      b: { c: "d" },
      e: undefined,
      f: () => {},
      g: new Date("2024-01-01T00:00:00.000Z"),
    }

    const output = parseStringifyIfNecessary(input)

    expect(output).toEqual({
      a: 1,
      b: { c: "d" },
      g: "2024-01-01T00:00:00.000Z",
    })
    expect(output.b).not.toBe(input.b)
  })

  it("should copy an object created with a null prototype", function () {
    const input = Object.create(null)
    input.a = 1
    input.nested = Object.create(null)
    input.nested.b = "c"

    expect(parseStringifyIfNecessary(input)).toEqual({
      a: 1,
      nested: { b: "c" },
    })
  })

  it("should copy an object that has its own hasOwnProperty key", function () {
    const input = JSON.parse('{"hasOwnProperty":"value","a":1}')

    expect(parseStringifyIfNecessary(input)).toEqual({
      hasOwnProperty: "value",
      a: 1,
    })
  })
})
