import { isPresent } from "../is-present"

describe("isPresent", function () {
  it("should return true or false for different types of data", function () {
    const expectations = [
      {
        input: null,
        output: false,
      },
      {
        input: undefined,
        output: false,
      },
      {
        input: "Testing",
        output: true,
      },
      {
        input: "",
        output: false,
      },
      {
        input: {},
        output: false,
      },
      {
        input: { test: 1 },
        output: true,
      },
      {
        input: [],
        output: false,
      },
      {
        input: [{ test: 1 }],
        output: true,
      },
      {
        input: new Map([["test", "test"]]),
        output: true,
      },
      {
        input: new Map([]),
        output: false,
      },

      {
        input: new Set(["test"]),
        output: true,
      },
      {
        input: new Set([]),
        output: false,
      },
    ]

    expectations.forEach((expectation) => {
      expect(isPresent(expectation.input)).toEqual(expectation.output)
    })
  })
})
