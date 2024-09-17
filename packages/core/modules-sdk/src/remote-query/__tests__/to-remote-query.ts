import { QueryContext } from "@medusajs/utils"
import "../__fixtures__/remote-query-type"
import "../__fixtures__/parse-filters"
import { toRemoteQuery } from "../to-remote-query"

describe("toRemoteQuery", () => {
  it("should transform a query with top level filtering", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: ["id", "handle", "description"],
      filters: {
        handle: {
          $ilike: "abc%",
        },
      },
    })

    expect(format).toEqual({
      product: {
        __fields: ["id", "handle", "description"],
        __args: {
          filters: {
            handle: {
              $ilike: "abc%",
            },
          },
        },
      },
    })
  })

  it("should transform a query with pagination", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: ["id", "handle", "description"],
      pagination: {
        skip: 5,
        take: 10,
      },
    })

    expect(format).toEqual({
      product: {
        __fields: ["id", "handle", "description"],
        __args: {
          skip: 5,
          take: 10,
        },
      },
    })
  })

  it("should transform a query with top level filtering and pagination", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: ["id", "handle", "description"],
      pagination: {
        skip: 5,
        take: 10,
      },
      filters: {
        handle: {
          $ilike: "abc%",
        },
      },
    })

    expect(format).toEqual({
      product: {
        __fields: ["id", "handle", "description"],
        __args: {
          skip: 5,
          take: 10,
          filters: {
            handle: {
              $ilike: "abc%",
            },
          },
        },
      },
    })
  })

  it("should transform a query with filters and context into remote query input [1]", () => {
    const format = toRemoteQuery({
      entity: "product",
      fields: [
        "id",
        "description",
        "variants.title",
        "variants.calculated_price",
        "variants.options.*",
      ],
      filters: {
        variants: {
          sku: {
            $ilike: "abc%",
          },
        },
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
        __fields: ["id", "description"],
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
          __fields: ["title", "calculated_price"],
          options: {
            __fields: ["*"],
          },
        },
      },
    })
  })

  it("should transform a query with filters and context into remote query input [2]", () => {
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
      filters: {
        id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
      },
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
