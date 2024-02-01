import { objectToStringPath } from "../object-to-string-path"

describe("objectToStringPath", function () {
  it("should return only the properties path of the properties that are set to true", function () {
    const res = objectToStringPath(
      {
        product: true,
        variants: {
          title: true,
          prices: {
            amount: true,
          },
        },
      },
      {
        includeParentPropertyFields: false,
      }
    )

    expect(res).toEqual(["product", "variants.title", "variants.prices.amount"])
  })

  it("should return a string path from an object including properties that are object and contains other properties set to true", function () {
    const res = objectToStringPath({
      product: true,
      variants: {
        title: true,
        prices: {
          amount: true,
        },
      },
    })

    expect(res).toEqual([
      "product",
      "variants",
      "variants.title",
      "variants.prices",
      "variants.prices.amount",
    ])
  })
})
