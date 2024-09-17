import { parseAndAssignFilters } from "../parse-filters"
import "../__fixtures__/parse-filters"

describe("parse-filters", () => {
  it("should parse filters through linked relations", () => {
    const filters = {
      id: "string",
      variants: {
        sku: {
          $eq: "string",
        },
        price_set: {
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

          price_set: {
            fields: ["id", "amount"],

            prices: {
              fields: ["id", "amount"],
            },
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
          filters: {
            id: "string",
            variants: {
              sku: {
                $eq: "string",
              },
            },
          },
        },

        variants: {
          fields: ["id", "sku", "prices"],

          price_set: {
            fields: ["id", "amount"],
            __args: {
              filters: {
                amount: {
                  $eq: 50,
                },
              },
            },

            prices: {
              fields: ["id", "amount"],
            },
          },
        },
      },
    })
  })

  it("should parse filters through linked nested relations", () => {
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
          filters: {
            id: "string",
            variants: {
              sku: {
                $eq: "string",
              },
            },
          },
        },

        variants: {
          fields: ["id", "sku", "prices"],

          prices: {
            fields: ["id", "amount"],

            __args: {
              filters: {
                prices: {
                  amount: {
                    $eq: 50,
                  },
                },
              },
            },
          },
        },
      },
    })
  })
})
