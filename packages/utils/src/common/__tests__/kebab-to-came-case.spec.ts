import { kebabToCamelCase } from "../kebab-to-camel-case"

describe("Kebab to camel case", function () {
  it("should convert kebab case to camel case", function () {
    const str = "kebab-case-string"
    const expected = "kebabCaseString"
    const actual = kebabToCamelCase(str)
    expect(actual).toEqual(expected)
  })
})
