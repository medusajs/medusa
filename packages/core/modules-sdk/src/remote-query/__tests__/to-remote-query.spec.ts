import { QueryContext } from "@medusajs/utils"
import { MedusaModule } from "../../medusa-module"
import { getEntitiesMap } from "../__fixtures__/get-entities-map"
import "../__fixtures__/parse-filters"
import "../__fixtures__/remote-query-type"
import { toRemoteQuery } from "../to-remote-query"

const entitiesMap = getEntitiesMap(
  MedusaModule.getAllJoinerConfigs()
    .map((m) => m.schema)
    .join("\n")
)

describe("toRemoteQuery", () => {
  it("should transform a query with top level filtering", () => {
    const format = toRemoteQuery(
      {
        entity: "product",
        fields: ["id", "handle", "description"],
        filters: {
          handle: {
            $ilike: "abc%",
          },
        },
      },
      entitiesMap
    )

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

  it("should transform a query with strategy", () => {
    const format = toRemoteQuery(
      {
        entity: "product",
        fields: ["id", "handle", "description"],
        strategy: "select-in",
      },
      entitiesMap
    )

    expect(format).toEqual({
      product: {
        __fields: ["id", "handle", "description"],
        __args: {
          options: {
            strategy: "select-in",
          },
        },
      },
    })
  })

  it("should transform a query with pagination", () => {
    const format = toRemoteQuery(
      {
        entity: "product",
        fields: ["id", "handle", "description"],
        pagination: {
          skip: 5,
          take: 10,
        },
      },
      entitiesMap
    )

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
    const format = toRemoteQuery(
      {
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
      },
      entitiesMap
    )

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
    const format = toRemoteQuery(
      {
        entity: "product",
        fields: [
          "id",
          "description",
          "variants.title",
          "variants.calculated_price",
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
      },
      entitiesMap
    )

    expect(format).toEqual({
      product: {
        __fields: ["id", "description"],
        __args: {
          filters: {
            variants: {
              sku: {
                $ilike: "abc%",
              },
            },
          },
        },
        variants: {
          calculated_price: {
            __args: {
              context: {
                region_id: "reg_123",
                currency_code: "usd",
              },
            },
          },
          __fields: ["title", "calculated_price"],
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

    const format = toRemoteQuery(
      {
        entity: "product",
        fields: [
          "id",
          "title",
          "description",
          "translation.*",
          "categories.*",
          "categories.translation.*",
          "variants.*",
          "variants.translation.*",
        ],
        filters: {
          id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
        },
        context: {
          translation: langContext,
          categories: {
            translation: langContext,
          },
          variants: {
            translation: langContext,
          },
        },
      },
      entitiesMap
    )

    expect(format).toEqual({
      product: {
        __fields: ["id", "title", "description"],
        __args: {
          filters: {
            id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
          },
        },
        translation: {
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
          translation: {
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
          translation: {
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

  it("should transform a query with filters, context and withDeleted into remote query input", () => {
    const langContext = QueryContext({
      context: {
        lang: "pt-br",
      },
    })

    const format = toRemoteQuery(
      {
        entity: "product",
        fields: [
          "id",
          "title",
          "description",
          "translation.*",
          "categories.*",
          "categories.translation.*",
          "variants.*",
          "variants.translation.*",
        ],
        filters: {
          id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
        },
        context: {
          translation: langContext,
          categories: {
            translation: langContext,
          },
          variants: {
            translation: langContext,
          },
        },
        withDeleted: true,
      },
      entitiesMap
    )

    expect(format).toEqual({
      product: {
        __fields: ["id", "title", "description"],
        __args: {
          filters: {
            id: "prod_01J742X0QPFW3R2ZFRTRC34FS8",
          },
          withDeleted: true,
        },
        translation: {
          __args: {
            context: {
              context: {
                lang: "pt-br",
              },
            },
            withDeleted: true,
          },
          __fields: ["*"],
        },
        categories: {
          translation: {
            __args: {
              context: {
                context: {
                  lang: "pt-br",
                },
              },
              withDeleted: true,
            },
            __fields: ["*"],
          },
          __fields: ["*"],
        },
        variants: {
          translation: {
            __args: {
              context: {
                context: {
                  lang: "pt-br",
                },
              },
              withDeleted: true,
            },
            __fields: ["*"],
          },
          __fields: ["*"],
        },
      },
    })
  })
})
