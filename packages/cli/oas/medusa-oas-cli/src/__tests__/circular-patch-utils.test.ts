import { OpenAPIObject } from "openapi3-ts/oas30"
import { getCircularPatchRecommendation } from "../utils/circular-patch-utils"

describe("getCircularPatchRecommendation", () => {
  const oas: OpenAPIObject = {
    openapi: "3.0.0",
    info: { title: "Test", version: "1.0.0" },
    paths: {},
    components: {
      schemas: {
        Order: {
          type: "object",
          properties: {
            customer: { $ref: "#/components/schemas/Customer" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/LineItem" },
            },
          },
        },
        LineItem: {
          type: "object",
          properties: {
            tax_lines: {
              type: "array",
              items: {
                allOf: [
                  { $ref: "#/components/schemas/TaxLine" },
                  {
                    type: "object",
                    properties: {
                      item: { $ref: "#/components/schemas/LineItem" },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  }

  it("should recommend patches for property and array item references", () => {
    const recommendation = getCircularPatchRecommendation(
      [
        "/tmp/store.oas.json#/components/schemas/Order/properties/customer",
        "/tmp/store.oas.json#/components/schemas/Order/properties/items/items",
      ],
      oas
    )

    expect(recommendation).toEqual({ Order: ["Customer", "LineItem"] })
  })

  it("should recommend patches for references nested in inline schemas", () => {
    const recommendation = getCircularPatchRecommendation(
      [
        "#/components/schemas/LineItem/properties/tax_lines/items/allOf/1/properties/item",
      ],
      oas
    )

    expect(recommendation).toEqual({ LineItem: ["LineItem"] })
  })

  it("should skip references that don't point to a schema", () => {
    const recommendation = getCircularPatchRecommendation(
      ["#/components/schemas/Order/properties/unknown"],
      oas
    )

    expect(recommendation).toEqual({})
  })
})
