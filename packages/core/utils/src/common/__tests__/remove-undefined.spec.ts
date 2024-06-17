import { removeUndefined } from "../remove-undefined"

describe("removeUndefined", function () {
  it("should remove all undefined fields from an object", function () {
    const withUndefined = {
      foo: undefined,
      bar: "baz",
      foo2: null,
    }
    expect(withUndefined.hasOwnProperty("foo")).toBe(true)

    const output = removeUndefined(withUndefined)
    expect(output.hasOwnProperty("foo")).toBe(false)
    expect(output.hasOwnProperty("bar")).toBe(true)
    expect(output.hasOwnProperty("foo2")).toBe(true)
  })

  it("should return an empty object as-is", function () {
    const output = removeUndefined({})
    expect(output).toEqual({})
  })
})
