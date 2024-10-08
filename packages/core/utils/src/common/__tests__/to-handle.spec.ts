import { toHandle } from "../to-handle"
import { isValidHandle } from "../validate-handle"

describe("normalizeHandle", function () {
  describe("should generate URL friendly handles", function () {
    const expectations = [
      {
        input: "The fan boy's club",
        output: "the-fan-boys-club",
      },
      {
        input: "nouvelles années",
        output: "nouvelles-annees",
      },
      {
        input: "25% OFF",
        output: "25-off",
      },
      {
        input: "25% de réduction",
        output: "25-de-reduction",
      },
      {
        input: "-first-product",
        output: "-first-product",
        invalid: true,
      },
      {
        input: "user.product",
        output: "userproduct",
      },
      {
        input: "_first-product",
        output: "-first-product",
        invalid: true,
      },
      {
        input: "_HELLO_WORLD",
        output: "-hello-world",
        invalid: true,
      },
      {
        input: "title: Hello - World",
        output: "title-hello-world",
      },
      {
        input: "hiphenated - title - __bold__",
        output: "hiphenated-title-bold-",
        invalid: true,
      },
    ]

    expectations.forEach((expectation) => {
      const handle = toHandle(expectation.input)
      it(`should convert "${expectation.input}" to "${expectation.output}"`, () => {
        expect(handle).toEqual(expectation.output)
        expect(isValidHandle(handle)).toBe(!expectation.invalid)
      })
    })
  })
})
