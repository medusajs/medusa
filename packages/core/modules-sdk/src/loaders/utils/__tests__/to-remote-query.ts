import { QueryContext, QueryFilter } from "@medusajs/utils"
import { toRemoteQuery } from "../../../remote-query/to-remote-query"

describe("toRemoteQuery", () => {
  it("should transform a query with top level filtering", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: ["id", "name", "description"],
      filter: QueryFilter({
        name: {
          $ilike: "abc%",
        },
      }),
    })

    expect(format).toEqual({
      product: {
        __fields: ["id", "name", "description"],
        __args: {
          filters: {
            name: {
              $ilike: "abc%",
            },
          },
        },
      },
    })
  })

  it("should transform a query with filter and context into remote query input", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: [
        "name",
        "description",
        "variants.sku",
        "variants.calculated_price",
        "variants.options.*",
      ],
      filter: {
        variants: QueryFilter({
          sku: {
            $ilike: "abc%",
          },
        }),
      },
      context: {
        variants: {
          calculated_price: QueryContext({
            region_id: "reg_123",
            currency_code: "usd",
          }),
        },
      },
    })

    expect(format).toEqual({
      product: {
        __fields: ["name", "description"],
        variants: {
          __args: {
            filters: {
              sku: {
                $ilike: "abc%",
              },
            },
          },
          calculated_price: {
            __args: {
              context: {
                region_id: "reg_123",
                currency_code: "usd",
              },
            },
          },
          __fields: ["sku", "calculated_price"],
          options: {
            __fields: ["*"],
          },
        },
      },
    })
  })

  it("should transform a query with filter and context into remote query input", () => {
    const langContext = QueryContext({
      context: {
        lang: "pt-br",
      },
    })

    const format = toRemoteQuery({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "product_translation.*",
        "categories.*",
        "categories.category_translation.*",
        "variants.*",
        "variants.variant_translation.*",
      ],
      filter: QueryFilter({
        id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
      }),
      context: {
        product_translation: langContext,
        categories: {
          category_translation: langContext,
        },
        variants: {
          variant_translation: langContext,
        },
      },
    })

    expect(format).toEqual({
      product: {
        __fields: ["id", "title", "description"],
        __args: {
          filters: {
            id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
          },
        },
        product_translation: {
          __args: {
            context: {
              context: {
                lang: "pt-br",
              },
            },
          },
          __fields: ["*"],
        },
        categories: {
          category_translation: {
            __args: {
              context: {
                context: {
                  lang: "pt-br",
                },
              },
            },
            __fields: ["*"],
          },
          __fields: ["*"],
        },
        variants: {
          variant_translation: {
            __args: {
              context: {
                context: {
                  lang: "pt-br",
                },
              },
            },
            __fields: ["*"],
          },
          __fields: ["*"],
        },
      },
    })
  })
})
