import { stringifyNullProperties } from "../../src/utils"

describe("stringifyNullProperties", () => {
  test("returns empty object on no props", () => {
    const result = stringifyNullProperties({})
    expect(result).toEqual({})
  })

  test("successfully stringifies null property", () => {
    const result = stringifyNullProperties({ test: null })
    expect(result).toEqual({ test: "null" })
  })

  test("successfully stringifies nested null property", () => {
    const result = stringifyNullProperties({
      test: { test_2: { test_3: null } },
      another_test: "test",
    })
    expect(result).toEqual({
      test: { test_2: { test_3: "null" } },
      another_test: "test",
    })
  })

  test("successfully stringifies string property", () => {
    const result = stringifyNullProperties({
      test: "test",
    })
    expect(result).toEqual({ test: "test" })
  })
})
