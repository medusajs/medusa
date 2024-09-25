import { normalizeFieldsSelection } from "../normalize-fields-selection"

describe("normalizeFieldsSelection", () => {
  it("should normalize fields selection", () => {
    const fields = [
      "product.id",
      "product.title",
      "product.variants.*",
      "product.variants.prices.*",
    ]
    const result = normalizeFieldsSelection(fields)
    expect(result).toEqual({
      product: {
        id: true,
        title: true,
        variants: {
          prices: true,
        },
      },
    })
  })
})
