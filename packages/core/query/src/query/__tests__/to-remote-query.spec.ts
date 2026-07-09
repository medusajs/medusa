import { QueryContext } from "@medusajs/utils"
import { parseFiltersJoinerConfigs } from "../__fixtures__/parse-filters"
import { parseAndAssignFilters, toRemoteQuery } from "../to-remote-query"

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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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
      parseFiltersJoinerConfigs
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

describe("parseAndAssignFilters", () => {
  describe("Without operator map usage", () => {
    it(`should parse filter for a single level module with ambiguous entity`, () => {
      const filters = {
        id: "string",
        product: {
          title: "test",
        },
      }

      const remoteQueryObject = {
        custom_product: {
          fields: ["id", "product.*"],
        },
      }

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "custom_product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

      expect(remoteQueryObject).toEqual({
        custom_product: {
          fields: ["id", "product.*"],
          __args: {
            filters: {
              id: "string",
              product: {
                title: "test",
              },
            },
          },
        },
      })
    })

    it("should parse filter for a single level module", () => {
      const filters = {
        id: "string",
      }

      const remoteQueryObject = {
        product: {
          fields: ["id", "title", "variants"],
        },
      }

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

      expect(remoteQueryObject).toEqual({
        product: {
          fields: ["id", "title", "variants"],
          __args: {
            filters: {
              id: "string",
            },
          },
        },
      })
    })

    it("should parse filters through linked immediate relations", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          price_set: {
            id: "id_test",
            prices: {
              amount: 50,
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

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                  id: "id_test",
                  prices: {
                    amount: 50,
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

    it("should parse filters through linked nested relations through configured field alias with forward args", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          prices: {
            amount: 50,
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

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                    amount: 50,
                  },
                },
              },
            },
          },
        },
      })
    })

    it("should parse filters through linked deep nested relations through configured field alias with forward args", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          prices: {
            amount: 50,

            deep_nested_price: {
              amount: 100,
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

              deep_nested_price: {
                fields: ["id", "amount"],
              },
            },
          },
        },
      }

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                    amount: 50,
                    deep_nested_price: {
                      amount: 100,
                    },
                  },
                },
              },

              deep_nested_price: {
                fields: ["id", "amount"],
              },
            },
          },
        },
      })
    })
  })

  describe("With operator map usage", () => {
    it("should parse filter for a single level module", () => {
      const filters = {
        id: { $ilike: "%string%" },
      }

      const remoteQueryObject = {
        product: {
          fields: ["id", "title", "variants"],
        },
      }

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

      expect(remoteQueryObject).toEqual({
        product: {
          fields: ["id", "title", "variants"],
          __args: {
            filters: {
              id: { $ilike: "%string%" },
            },
          },
        },
      })
    })

    it("should parse filters through linked immediate relations", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          price_set: {
            id: "id_test",
            prices: {
              amount: {
                $gte: 50,
              },
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

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                  id: "id_test",
                  prices: {
                    amount: {
                      $gte: 50,
                    },
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

    it("should parse filters through linked nested relations through configured field alias with forward args", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          prices: {
            amount: {
              $lt: 50,
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

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                    amount: { $lt: 50 },
                  },
                },
              },
            },
          },
        },
      })
    })

    it("should parse filters through linked deep nested relations through configured field alias with forward args", () => {
      const filters = {
        id: "string",
        variants: {
          sku: {
            $eq: "string",
          },
          prices: {
            deep_nested_price: {
              amount: {
                $gte: 100,
              },
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

              deep_nested_price: {
                fields: ["id", "amount"],
              },
            },
          },
        },
      }

      parseAndAssignFilters(
        {
          remoteQueryObject,
          entryPoint: "product",
          filters,
        },
        parseFiltersJoinerConfigs
      )

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
                    deep_nested_price: {
                      amount: { $gte: 100 },
                    },
                  },
                },
              },

              deep_nested_price: {
                fields: ["id", "amount"],
              },
            },
          },
        },
      })
    })
  })
})
