import { getDuplicates } from "../get-duplicates"

describe("getDuplicates", function () {
  it("should return an empty array if there are no duplicates", function () {
    const output = getDuplicates(["foo", "bar", "baz"])
    expect(output).toHaveLength(0)
  })

  it("should return a singular duplicate", function () {
    const output = getDuplicates(["foo", "bar", "baz", "baz", "baz"])
    expect(output).toHaveLength(1)
    expect(output[0]).toEqual("baz")
  })

  it("should return all duplicates in the array", function () {
    const output = getDuplicates(["foo", "bar", "bar", "baz", "baz", "baz"])
    expect(output).toHaveLength(2)
    expect(output).toEqual(expect.arrayContaining(["baz", "bar"]))
  })
})
