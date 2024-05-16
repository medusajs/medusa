import { toHandle } from "../to-handle"

describe("normalizeHandle", function () {
  it("should generate URL friendly handles", function () {
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
      },
      {
        input: "user.product",
        output: "userproduct",
      },
      {
        input: "_first-product",
        output: "-first-product",
      },
      {
        input: "_HELLO_WORLD",
        output: "-hello-world",
      },
    ]

    expectations.forEach((expectation) => {
      expect(toHandle(expectation.input)).toEqual(expectation.output)
    })
  })
})
