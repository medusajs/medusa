import { parseAndAssignFilters } from "../parse-filters"
import "../__fixtures__/parse-filters"

describe("parse-filters", () => {
  it("should parse filters", () => {
    const filters = {
      id: "string",
      variants: {
        sku: {
          $eq: "string",
        },
        prices: {
          amount: {
            $eq: 50,
          },
        },
      },
    }

    const remoteQueryObject = {
      product: {
        fields: ["id", "title", "variants"],

        variants: {
          fields: ["id", "sku", "prices"],

          prices: {
            fields: ["id", "amount"],
          },
        },
      },
    }

    parseAndAssignFilters({
      remoteQueryObject,
      entryPoint: "product",
      filters,
    })

    expect(remoteQueryObject).toEqual({
      product: {
        fields: ["id", "title", "variants"],
        __args: {
          id: "string",
        },

        variants: {
          fields: ["id", "sku", "prices"],

          __args: {
            sku: {
              $eq: "string",
            },
          },

          prices: {
            fields: ["id", "amount"],

            __args: {
              amount: {
                $eq: 50,
              },
            },
          },
        },
      },
    })
  })
})
