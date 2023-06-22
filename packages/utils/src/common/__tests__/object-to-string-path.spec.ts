import { objectToStringPath } from "../object-to-string-path"

describe("objectToStringPath", function () {
  it("should return a string path from an object without the top leaf", function () {
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
        includeTopLeaf: false,
      }
    )

    expect(res).toEqual(["product", "variants.title", "variants.prices.amount"])
  })

  it("should return a string path from an object with the top leaf", function () {
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
