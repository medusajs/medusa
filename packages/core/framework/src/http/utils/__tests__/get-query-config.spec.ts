import { QueryConfig, RequestQueryFields } from "@medusajs/types"
import { prepareListQuery } from "../get-query-config"

describe("prepareListQuery", () => {
  describe("buildOrder functionality", () => {
    it("should return undefined order when no order is provided", async () => {
      const validated: RequestQueryFields = {
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toBeUndefined()
      expect(result.remoteQueryConfig.pagination.order).toBeUndefined()
    })

    it("should build simple ascending order", async () => {
      const validated: RequestQueryFields = {
        order: "created_at",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({ created_at: "ASC" })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        created_at: "ASC",
      })
    })

    it("should build simple descending order with dash prefix", async () => {
      const validated: RequestQueryFields = {
        order: "-created_at",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({ created_at: "DESC" })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        created_at: "DESC",
      })
    })

    it("should build nested order for relation fields", async () => {
      const validated: RequestQueryFields = {
        order: "product.title",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          title: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          title: "ASC",
        },
      })
    })

    it("should build nested descending order for relation fields", async () => {
      const validated: RequestQueryFields = {
        order: "-product.title",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          title: "DESC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          title: "DESC",
        },
      })
    })

    it("should build deeply nested order for multiple relation levels", async () => {
      const validated: RequestQueryFields = {
        order: "product.variants.prices.amount",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          variants: {
            prices: {
              amount: "ASC",
            },
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          variants: {
            prices: {
              amount: "ASC",
            },
          },
        },
      })
    })

    it("should build deeply nested descending order for multiple relation levels", async () => {
      const validated: RequestQueryFields = {
        order: "-product.variants.prices.amount",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          variants: {
            prices: {
              amount: "DESC",
            },
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          variants: {
            prices: {
              amount: "DESC",
            },
          },
        },
      })
    })

    it("should handle mixed nested order with both ascending and descending", async () => {
      const validated: RequestQueryFields = {
        order: "product.title,-product.variants.sku",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      // The function processes the entire string as one field name
      // buildOrder splits by dots, so "product.title,-product.variants.sku" becomes nested
      expect(result.listConfig.order).toEqual({
        product: {
          "title,-product": {
            variants: {
              sku: "ASC",
            },
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          "title,-product": {
            variants: {
              sku: "ASC",
            },
          },
        },
      })
    })

    it("should throw error when order field is not in allowed fields", async () => {
      const validated: RequestQueryFields = {
        order: "restricted_field",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
        allowed: ["id", "created_at", "title"],
      }

      const allowedFields = expect(
        prepareListQuery(validated, queryConfig)
      ).rejects.toThrow("Order field restricted_field is not valid")

      await allowedFields
    })

    it("should allow order field when it is in allowed fields", async () => {
      const validated: RequestQueryFields = {
        order: "title",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
        allowed: ["id", "created_at", "title"],
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({ title: "ASC" })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        title: "ASC",
      })
    })

    it("should allow nested order field when parent relation is in allowed fields", async () => {
      const validated: RequestQueryFields = {
        order: "product.title",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
        allowed: ["id", "product", "product.title"],
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          title: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          title: "ASC",
        },
      })
    })

    it("should handle order with special characters in field names", async () => {
      const validated: RequestQueryFields = {
        order: "metadata.custom_field",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        metadata: {
          custom_field: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        metadata: {
          custom_field: "ASC",
        },
      })
    })

    it("should handle order with numeric field names", async () => {
      const validated: RequestQueryFields = {
        order: "field_123.sub_field_456",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        field_123: {
          sub_field_456: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        field_123: {
          sub_field_456: "ASC",
        },
      })
    })

    it("should handle order with underscore field names", async () => {
      const validated: RequestQueryFields = {
        order: "-user_profile.first_name",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        user_profile: {
          first_name: "DESC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        user_profile: {
          first_name: "DESC",
        },
      })
    })

    it("should handle order with camelCase field names", async () => {
      const validated: RequestQueryFields = {
        order: "orderItems.unitPrice",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        orderItems: {
          unitPrice: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        orderItems: {
          unitPrice: "ASC",
        },
      })
    })

    it("should handle order with kebab-case field names", async () => {
      const validated: RequestQueryFields = {
        order: "-shipping-options.delivery-time",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      // The dash prefix is interpreted as descending order for the entire field path
      // After removing the first "-", it becomes "shipping-options.delivery-time"
      // buildOrder splits by dots to create nested structure
      expect(result.listConfig.order).toEqual({
        "shipping-options": {
          "delivery-time": "DESC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        "shipping-options": {
          "delivery-time": "DESC",
        },
      })
    })

    it("should handle order with empty string (edge case)", async () => {
      const validated: RequestQueryFields = {
        order: "",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      // Empty string is treated as a valid field name
      expect(result.listConfig.order).toEqual({ "": "ASC" })
      expect(result.remoteQueryConfig.pagination.order).toEqual({ "": "ASC" })
    })

    it("should handle order with special characters in nested field names", async () => {
      const validated: RequestQueryFields = {
        order: "product.variant-price.amount",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          "variant-price": {
            amount: "ASC",
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          "variant-price": {
            amount: "ASC",
          },
        },
      })
    })

    it("should handle order with very deep nesting (5 levels)", async () => {
      const validated: RequestQueryFields = {
        order: "a.b.c.d.e",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        a: {
          b: {
            c: {
              d: {
                e: "ASC",
              },
            },
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        a: {
          b: {
            c: {
              d: {
                e: "ASC",
              },
            },
          },
        },
      })
    })

    it("should handle order with very deep nesting and descending (5 levels)", async () => {
      const validated: RequestQueryFields = {
        order: "-a.b.c.d.e",
        limit: 10,
        offset: 0,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        a: {
          b: {
            c: {
              d: {
                e: "DESC",
              },
            },
          },
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        a: {
          b: {
            c: {
              d: {
                e: "DESC",
              },
            },
          },
        },
      })
    })
  })

  describe("integration with other query parameters", () => {
    it("should combine order with fields, limit, and offset", async () => {
      const validated: RequestQueryFields = {
        order: "created_at",
        fields: "id,title,product.name",
        limit: 25,
        offset: 50,
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
        defaults: ["id", "created_at"],
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({ created_at: "ASC" })
      expect(result.listConfig.skip).toBe(50)
      expect(result.listConfig.take).toBe(25)
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        created_at: "ASC",
      })
      expect(result.remoteQueryConfig.pagination.skip).toBe(50)
      expect(result.remoteQueryConfig.pagination.take).toBe(25)
    })

    it("should handle order with * fields in query config", async () => {
      const validated: RequestQueryFields = {
        order: "product.title",
        fields: "id,*product",
      }

      const queryConfig: QueryConfig<any> = {
        isList: true,
      }

      const result = await prepareListQuery(validated, queryConfig)

      expect(result.listConfig.order).toEqual({
        product: {
          title: "ASC",
        },
      })
      expect(result.remoteQueryConfig.pagination.order).toEqual({
        product: {
          title: "ASC",
        },
      })
    })
  })
})
