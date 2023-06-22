import { objectToStringPath } from "../object-to-string-path"

describe("objectToStringPath", function () {
  it("should return a string path from an object", function () {
    const res = objectToStringPath({
      product: true,
      variants: {
        title: true,
        prices: {
          amount: true,
        },
      },
    })

    expect(res).toEqual(["product", "variants.title", "variants.prices.amount"])
  })
})
