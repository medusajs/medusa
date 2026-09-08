import { Knex } from "@medusajs/deps/mikro-orm/postgresql"
import {
  augmentFindOptionsWithCrossModuleJoins,
  buildTargetFilterSql,
} from "../cross-module-query"

// Kept for unit tests that validate operator-to-SQL translation independently.
function applyFiltersToKnex(
  qb: Knex.QueryBuilder,
  alias: string,
  filters: Record<string, any>
): void {
  const { sql, bindings } = buildTargetFilterSql(alias, filters)

  if (!sql) {
    return
  }

  qb.whereRaw(sql, bindings)
}

describe("cross-module-query", () => {
  describe("applyFiltersToKnex", () => {
    const buildMockQueryBuilder = () => {
      const calls: any[] = []
      const qb: any = {
        calls,
        whereRaw: jest.fn(function (...args) {
          calls.push(["whereRaw", ...args])
          return this
        }),
      }

      return qb
    }

    it("should apply simple equality filters", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { handle: "premium" })

      expect(qb.whereRaw).toHaveBeenCalledWith('"product"."handle" = ?', [
        "premium",
      ])
    })

    it("should apply operator filters", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        handle: { $in: ["premium", "standard"] },
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"product"."handle" = any(array[?, ?])',
        ["premium", "standard"]
      )
    })

    it("should use any(array[...]) for large $in lists", () => {
      const qb = buildMockQueryBuilder()
      const ids = Array.from({ length: 500 }, (_, index) => `id_${index}`)

      applyFiltersToKnex(qb, "product", { id: { $in: ids } })

      const [sql, bindings] = qb.calls[0].slice(1)
      expect(sql).toBe(
        `"product"."id" = any(array[${ids.map(() => "?").join(", ")}])`
      )
      expect(bindings).toEqual(ids)
    })

    it("should use any(array[...]) for $nin", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        id: { $nin: ["prod_a", "prod_b"] },
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        'not ("product"."id" = any(array[?, ?]))',
        ["prod_a", "prod_b"]
      )
    })

    it("should apply null filters", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { deleted_at: null })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"product"."deleted_at" is null',
        []
      )
    })

    it("should translate comparison operators", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        created_at: { $gt: 1, $lte: 10 },
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"product"."created_at" > ? and "product"."created_at" <= ?',
        [1, 10]
      )
    })

    it("should translate $ne null to is not null", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { handle: { $ne: null } })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"product"."handle" is not null',
        []
      )
    })

    it("should translate empty $in to an always-false clause", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { id: { $in: [] } })

      expect(qb.whereRaw).toHaveBeenCalledWith("1 = 0", [])
    })

    it("should drop empty $nin (matches everything)", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { id: { $nin: [] } })

      // Nothing to constrain -> whereRaw should not be invoked
      expect(qb.whereRaw).not.toHaveBeenCalled()
    })

    it("should translate $or into a grouped clause", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        $or: [{ handle: "premium" }, { handle: "standard" }],
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '(("product"."handle" = ?) or ("product"."handle" = ?))',
        ["premium", "standard"]
      )
    })

    it("should combine sibling keys with AND alongside $or", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        $or: [{ handle: "premium" }],
        deleted_at: null,
      })

      const [sql, bindings] = qb.calls[0].slice(1)
      expect(sql).toContain(" and ")
      expect(sql).toContain('"product"."deleted_at" is null')
      expect(bindings).toEqual(["premium"])
    })

    it("should drop an empty $or instead of emitting an invalid group", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", { $or: [] })

      // No constraint -> whereRaw must not be invoked with `()`.
      expect(qb.whereRaw).not.toHaveBeenCalled()
    })

    it("should drop $or branches that resolve to nothing", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        $or: [{ handle: undefined }, { handle: "premium" }],
      })

      expect(qb.whereRaw).toHaveBeenCalledWith('(("product"."handle" = ?))', [
        "premium",
      ])
    })

    it("should drop $and branches that resolve to nothing", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "product", {
        $and: [{ handle: undefined }, { handle: "premium" }],
      })

      expect(qb.whereRaw).toHaveBeenCalledWith('("product"."handle" = ?)', [
        "premium",
      ])
    })
  })

  describe("augmentFindOptionsWithCrossModuleJoins", () => {
    const buildProductJoinMetadata = (filters?: Record<string, unknown>) => ({
      link: {
        table: "order_product_link",
        sourceKey: "order_id",
        targetKey: "product_id",
      },
      target: {
        table: "product",
        filters,
      },
    })

    const buildRegionJoinMetadata = (filters?: Record<string, unknown>) => ({
      link: {
        table: "order_region_link",
        sourceKey: "order_id",
        targetKey: "region_id",
      },
      target: {
        table: "region",
        filters,
      },
    })

    const buildSalesChannelJoinMetadata = (
      filters?: Record<string, unknown>
    ) => ({
      parent: "product",
      link: {
        table: "product_sales_channel",
        sourceKey: "product_id",
        targetKey: "sales_channel_id",
      },
      target: {
        table: "sales_channel",
        filters,
      },
    })

    it("should translate cross-module filters into where clauses", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: { display_id: "1001" } as any,
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.options?.__internal?.crossModuleJoins).toBeUndefined()
      expect(result.where?.$and).toHaveLength(2)
      expect(result.where?.$and?.[0]).toEqual({ display_id: "1001" })

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[1]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."order_product_link"/
      )
      expect(existsSql).toMatch(/"cm_link_0"\."order_id" = "o0"\."id"/)
      expect(existsSql).toMatch(/"product"\."handle" = \?/)
      expect(existsSql).toMatch(/"deleted_at" is null/)
    })

    it("should combine multiple root joins into separate exists clauses", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
                buildRegionJoinMetadata({ code: "eu" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(2)
      const keys = (result.where?.$and as Record<string, unknown>[]).map(
        (clause) => Object.keys(clause)[0]
      )
      expect(keys[0]).toContain("product")
      expect(keys[1]).toContain("region")
    })

    it("should combine multiple root target filters with AND semantics", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
                buildRegionJoinMetadata({ code: "eu" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(2)
      const keys = (result.where?.$and as Record<string, unknown>[]).map(
        (clause) => Object.keys(clause)[0]
      )
      expect(keys[0]).toContain("product")
      expect(keys[0]).toMatch(/"product"\."handle" = \?/)
      expect(keys[1]).toContain("region")
      expect(keys[1]).toMatch(/"region"\."code" = \?/)
    })

    it("should nest parent joins as correlated exists inside the parent join", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata(),
                buildSalesChannelJoinMetadata({ name: "web-store" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."order_product_link"/
      )
      expect(existsSql).toMatch(/"cm_link_0"\."order_id" = "o0"\."id"/)
      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."product_sales_channel"/
      )
      expect(existsSql).toMatch(/"cm_link_1"\."product_id" = "product"\."id"/)
      expect(existsSql).toMatch(/"sales_channel"\."name" = \?/)
    })

    it("should combine parent target filters with nested child filters", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
                buildSalesChannelJoinMetadata({ name: "web-store" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"product"\."handle" = \?/)
      expect(existsSql).toMatch(/"sales_channel"\."name" = \?/)
      expect(existsSql).toMatch(/"cm_link_1"\."product_id" = "product"\."id"/)
    })

    it("should support deeply nested parent chains recursively", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata(),
                buildSalesChannelJoinMetadata(),
                {
                  parent: "sales_channel",
                  link: {
                    table: "sales_channel_region_link",
                    sourceKey: "sales_channel_id",
                    targetKey: "region_id",
                  },
                  target: {
                    table: "region",
                    filters: { code: "eu" },
                  },
                },
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"cm_link_1"\."product_id" = "product"\."id"/)
      expect(existsSql).toMatch(
        /"cm_link_2"\."sales_channel_id" = "sales_channel"\."id"/
      )
      expect(existsSql).toMatch(/"region"\."code" = \?/)
      expect(existsSql.match(/exists \(select 1 from/g)?.length).toBe(3)
    })

    it("should not emit a top-level exists for parent-only joins", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata(),
                buildSalesChannelJoinMetadata({ name: "web-store" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toHaveLength(1)
    })

    it("should throw on unknown parent references", () => {
      expect(() =>
        augmentFindOptionsWithCrossModuleJoins(
          {
            where: {},
            options: {
              __internal: {
                crossModuleJoins: [
                  {
                    parent: "missing",
                    link: {
                      table: "product_sales_channel",
                      sourceKey: "product_id",
                      targetKey: "sales_channel_id",
                    },
                    target: {
                      table: "sales_channel",
                      filters: { name: "web-store" },
                    },
                  },
                ],
              },
            },
          },
          { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
        )
      ).toThrow(/unknown parent target table/)
    })

    it("should not add a where clause for joins without target filters", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: { display_id: "1001" } as any,
          options: {
            __internal: {
              crossModuleJoins: [buildProductJoinMetadata()],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      expect(result.where?.$and).toBeUndefined()
      expect(result.where).toEqual({ display_id: "1001" })
    })

    it("should apply soft-delete guards by default", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"deleted_at" is null/)
      expect(existsSql).toMatch(/"product"\."handle" = \?/)
    })

    it("should drop soft-delete guards when the query runs with withDeleted", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            filters: { softDeletable: { withDeleted: true } },
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).not.toMatch(/deleted_at/)
      expect(existsSql).toMatch(/"product"\."handle" = \?/)
    })

    it("should still guard soft-deletes when withDeleted is not requested", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            filters: { softDeletable: true },
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ handle: "premium" }),
              ],
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"deleted_at" is null/)
    })

    it("should derive the root alias from the entity name", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                {
                  link: {
                    table: "order_product_link",
                    sourceKey: "product_id",
                    targetKey: "order_id",
                  },
                  target: {
                    table: "order",
                    filters: { display_id: "1001" },
                  },
                },
              ],
            },
          },
        },
        {
          primaryKey: "id",
          entityName: "ProductEntity",
          entityTable: "product",
        }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"p0"\."id"/)
    })

    it("should not mutate the caller's find options", () => {
      const crossModuleJoins = [buildProductJoinMetadata({ handle: "premium" })]
      const input = {
        where: { display_id: "1001" } as any,
        options: { __internal: { crossModuleJoins } },
      }

      augmentFindOptionsWithCrossModuleJoins(input, {
        primaryKey: "id",
        entityName: "OrderEntity",
        entityTable: "order",
      })

      expect(input.options.__internal?.crossModuleJoins).toBe(crossModuleJoins)
      expect(input.where).toEqual({ display_id: "1001" })
    })

    it("should translate cross-module order keys into scalar subqueries", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [buildProductJoinMetadata()],
            },
            orderBy: {
              "product.handle": "ASC",
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["product.handle"]).toBeUndefined()
      expect(Object.keys(orderBy)).toHaveLength(1)
      expect(Object.values(orderBy)[0]).toBe("ASC")

      const orderSql = Object.keys(orderBy)[0]

      expect(orderSql).toMatch(
        /\(select "product"\."handle" from "public"\."order_product_link"/
      )
      expect(orderSql).toMatch(/"cm_order_link_0"\."order_id" = "o0"\."id"/)
      expect(orderSql).toMatch(/order by "product"\."id" limit 1\)/)
    })

    it("should throw on duplicate join target tables", () => {
      expect(() =>
        augmentFindOptionsWithCrossModuleJoins(
          {
            where: {},
            options: {
              __internal: {
                crossModuleJoins: [
                  buildProductJoinMetadata(),
                  {
                    link: {
                      table: "order_product_link_2",
                      sourceKey: "order_id",
                      targetKey: "product_id",
                    },
                    target: { table: "product" },
                  },
                ],
              },
            },
          },
          { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
        )
      ).toThrow(/Duplicate cross-module join target table/)
    })

    it("should filter on the link table when the target filter is only the primary key", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                buildProductJoinMetadata({ id: "prod_premium" }),
              ],
            },
            orderBy: {
              "product.id": "ASC",
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."order_product_link" as "cm_link_0" where/
      )
      expect(existsSql).not.toMatch(/inner join/)
      expect(existsSql).toMatch(/"cm_link_0"\."order_id" = "o0"\."id"/)
      expect(existsSql).toMatch(/"cm_link_0"\."product_id" = \?/)
      expect(existsSql).toMatch(/"cm_link_0"\."deleted_at" is null/)
      expect(existsSql).not.toMatch(/"product"\./)

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["product.id"]).toBeUndefined()
      expect(Object.keys(orderBy)).toHaveLength(1)
      expect(Object.values(orderBy)[0]).toBe("ASC")

      const orderSql = Object.keys(orderBy)[0]

      expect(orderSql).toMatch(
        /\(select "cm_order_link_0"\."product_id" from "public"\."order_product_link"/
      )
      expect(orderSql).toMatch(/"cm_order_link_0"\."order_id" = "o0"\."id"/)
      expect(orderSql).not.toMatch(/inner join/)
      expect(orderSql).not.toMatch(/"product"\./)
      expect(orderSql).toMatch(
        /order by "cm_order_link_0"\."product_id" limit 1\)/
      )
    })

    it("should skip the link-to-target join for target links", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                {
                  link: {
                    table: "order_line_item",
                    sourceKey: "id",
                    targetKey: "id",
                  },
                  target: {
                    table: "order_line_item",
                    filters: { product_id: "prod_premium" },
                  },
                },
              ],
            },
            orderBy: {
              "order_line_item.product_id": "ASC",
            },
          },
        },
        {
          primaryKey: "id",
          entityName: "OrderLineItemEntity",
          entityTable: "order_line_item",
        }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."order_line_item" as "order_line_item" where/
      )
      expect(existsSql).not.toMatch(/inner join/)
      expect(existsSql).toMatch(/"order_line_item"\."id" = "o0"\."id"/)
      expect(existsSql).toMatch(/"order_line_item"\."product_id" = \?/)
      expect(existsSql).toMatch(/"order_line_item"\."deleted_at" is null/)
      expect(existsSql).not.toMatch(/cm_link_0/)

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["order_line_item.product_id"]).toBeUndefined()
      expect(Object.keys(orderBy)).toHaveLength(1)
      expect(Object.values(orderBy)[0]).toBe("ASC")

      const orderSql = Object.keys(orderBy)[0]

      expect(orderSql).toMatch(
        /\(select "order_line_item"\."product_id" from "public"\."order_line_item"/
      )
      expect(orderSql).toMatch(/"order_line_item"\."id" = "o0"\."id"/)
      expect(orderSql).not.toMatch(/inner join/)
      expect(orderSql).not.toMatch(/cm_order_link_0/)
      expect(orderSql).toMatch(/order by "order_line_item"\."id" limit 1\)/)
    })

    it("should skip the link-to-target join for source links", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [
                {
                  link: {
                    table: "order_line_item",
                    sourceKey: "id",
                    targetKey: "product_id",
                  },
                  target: {
                    table: "product",
                    filters: { handle: "premium" },
                  },
                },
              ],
            },
            orderBy: {
              "product.handle": "ASC",
            },
          },
        },
        {
          primaryKey: "id",
          entityName: "OrderLineItemEntity",
          entityTable: "order_line_item",
        }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."product" as "product" where/
      )
      expect(existsSql).not.toMatch(/inner join/)
      expect(existsSql).toMatch(/"product"\."id" = "o0"\."product_id"/)
      expect(existsSql).toMatch(/"product"\."handle" = \?/)
      expect(existsSql).toMatch(/"product"\."deleted_at" is null/)
      expect(existsSql).not.toMatch(/cm_link_0/)
      expect(existsSql).not.toMatch(/order_line_item/)

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["product.handle"]).toBeUndefined()
      expect(Object.keys(orderBy)).toHaveLength(1)
      expect(Object.values(orderBy)[0]).toBe("ASC")

      const orderSql = Object.keys(orderBy)[0]

      expect(orderSql).toMatch(
        /\(select "product"\."handle" from "public"\."product"/
      )
      expect(orderSql).toMatch(/"product"\."id" = "o0"\."product_id"/)
      expect(orderSql).not.toMatch(/inner join/)
      expect(orderSql).not.toMatch(/cm_order_link_0/)
      expect(orderSql).toMatch(/order by "product"\."id" limit 1\)/)
    })

    it("should leave non-cross-module order keys untouched", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: {
              crossModuleJoins: [buildProductJoinMetadata()],
            },
            orderBy: {
              display_id: "DESC",
              "product.handle": "ASC",
            },
          },
        },
        { primaryKey: "id", entityName: "OrderEntity", entityTable: "order" }
      )

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["display_id"]).toBe("DESC")
      expect(Object.keys(orderBy)).toHaveLength(2)
    })
  })
})
