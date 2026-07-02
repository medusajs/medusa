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

      applyFiltersToKnex(qb, "customer", { email: "test@example.com" })

      expect(qb.whereRaw).toHaveBeenCalledWith('"customer"."email" = ?', [
        "test@example.com",
      ])
    })

    it("should apply operator filters", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        email: { $in: ["a@example.com", "b@example.com"] },
      })

      expect(qb.whereRaw).toHaveBeenCalledWith('"customer"."email" in (?, ?)', [
        "a@example.com",
        "b@example.com",
      ])
    })

    it("should apply null filters", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", { deleted_at: null })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"customer"."deleted_at" is null',
        []
      )
    })

    it("should translate comparison operators", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        created_at: { $gt: 1, $lte: 10 },
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"customer"."created_at" > ? and "customer"."created_at" <= ?',
        [1, 10]
      )
    })

    it("should translate $ne null to is not null", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", { email: { $ne: null } })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '"customer"."email" is not null',
        []
      )
    })

    it("should translate empty $in to an always-false clause", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", { id: { $in: [] } })

      expect(qb.whereRaw).toHaveBeenCalledWith("1 = 0", [])
    })

    it("should drop empty $nin (matches everything)", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", { id: { $nin: [] } })

      // Nothing to constrain -> whereRaw should not be invoked
      expect(qb.whereRaw).not.toHaveBeenCalled()
    })

    it("should translate $or into a grouped clause", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        $or: [{ email: "a@example.com" }, { email: "b@example.com" }],
      })

      expect(qb.whereRaw).toHaveBeenCalledWith(
        '(("customer"."email" = ?) or ("customer"."email" = ?))',
        ["a@example.com", "b@example.com"]
      )
    })

    it("should combine sibling keys with AND alongside $or", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        $or: [{ email: "a@example.com" }],
        deleted_at: null,
      })

      const [sql, bindings] = qb.calls[0].slice(1)
      expect(sql).toContain(" and ")
      expect(sql).toContain('"customer"."deleted_at" is null')
      expect(bindings).toEqual(["a@example.com"])
    })

    it("should drop an empty $or instead of emitting an invalid group", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", { $or: [] })

      // No constraint -> whereRaw must not be invoked with `()`.
      expect(qb.whereRaw).not.toHaveBeenCalled()
    })

    it("should drop $or branches that resolve to nothing", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        $or: [{ email: undefined }, { email: "a@example.com" }],
      })

      // The undefined branch is skipped, leaving a single-branch group.
      expect(qb.whereRaw).toHaveBeenCalledWith('(("customer"."email" = ?))', [
        "a@example.com",
      ])
    })

    it("should drop $and branches that resolve to nothing", () => {
      const qb = buildMockQueryBuilder()

      applyFiltersToKnex(qb, "customer", {
        $and: [{ email: undefined }, { email: "a@example.com" }],
      })

      expect(qb.whereRaw).toHaveBeenCalledWith('("customer"."email" = ?)', [
        "a@example.com",
      ])
    })
  })

  describe("augmentFindOptionsWithCrossModuleJoins", () => {
    it("should translate cross-module filters into where clauses", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: { email: "alice@example.com" } as any,
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.options?.__internal?.crossModuleJoins).toBeUndefined()
      expect(result.where?.$and).toHaveLength(2)
      expect(result.where?.$and?.[0]).toEqual({ email: "alice@example.com" })

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[1]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."customer_pricing_tier_link"/
      )
      expect(existsSql).toMatch(/"cm_link_0"\."customer_id" = "c0"\."id"/)
      expect(existsSql).toMatch(/"pricing_tier"\."handle" = \?/)
      expect(existsSql).toMatch(/"deleted_at" is null/)
    })

    it("should combine multiple root joins into separate exists clauses", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
              {
                alias: "group",
                link: {
                  table: "customer_group_link",
                  sourceKey: "customer_id",
                  targetKey: "group_id",
                },
                target: {
                  table: "customer_group",
                  filters: { name: "vip" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(2)
      const keys = (result.where?.$and as Record<string, unknown>[]).map(
        (clause) => Object.keys(clause)[0]
      )
      expect(keys[0]).toContain("pricing_tier_entity")
      expect(keys[1]).toContain("customer_group")
    })

    it("should combine multiple root target filters with AND semantics", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
              {
                alias: "region",
                link: {
                  table: "customer_region_link",
                  sourceKey: "customer_id",
                  targetKey: "region_id",
                },
                target: {
                  table: "region_entity",
                  filters: { code: "eu" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(2)
      const keys = (result.where?.$and as Record<string, unknown>[]).map(
        (clause) => Object.keys(clause)[0]
      )
      expect(keys[0]).toContain("pricing_tier_entity")
      expect(keys[0]).toMatch(/"pricing_tier"\."handle" = \?/)
      expect(keys[1]).toContain("region_entity")
      expect(keys[1]).toMatch(/"region"\."code" = \?/)
    })

    it("should nest parent joins as correlated exists inside the parent join", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
              {
                alias: "functionality",
                parent: "pricing_tier",
                link: {
                  table: "tier_functionality_link",
                  sourceKey: "pricing_tier_id",
                  targetKey: "functionality_id",
                },
                target: {
                  table: "functionality_entity",
                  filters: { handle: "billing" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."customer_pricing_tier_link"/
      )
      expect(existsSql).toMatch(/"cm_link_0"\."customer_id" = "c0"\."id"/)
      expect(existsSql).toMatch(
        /exists \(select 1 from "public"\."tier_functionality_link"/
      )
      expect(existsSql).toMatch(
        /"cm_link_1"\."pricing_tier_id" = "pricing_tier"\."id"/
      )
      expect(existsSql).toMatch(/"functionality"\."handle" = \?/)
    })

    it("should combine parent target filters with nested child filters", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
              {
                alias: "functionality",
                parent: "pricing_tier",
                link: {
                  table: "tier_functionality_link",
                  sourceKey: "pricing_tier_id",
                  targetKey: "functionality_id",
                },
                target: {
                  table: "functionality_entity",
                  filters: { handle: "billing" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"pricing_tier"\."handle" = \?/)
      expect(existsSql).toMatch(/"functionality"\."handle" = \?/)
      expect(existsSql).toMatch(
        /"cm_link_1"\."pricing_tier_id" = "pricing_tier"\."id"/
      )
    })

    it("should support deeply nested parent chains recursively", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
              {
                alias: "functionality",
                parent: "pricing_tier",
                link: {
                  table: "tier_functionality_link",
                  sourceKey: "pricing_tier_id",
                  targetKey: "functionality_id",
                },
                target: {
                  table: "functionality_entity",
                },
              },
              {
                alias: "permission",
                parent: "functionality",
                link: {
                  table: "functionality_permission_link",
                  sourceKey: "functionality_id",
                  targetKey: "permission_id",
                },
                target: {
                  table: "permission_entity",
                  filters: { code: "billing:write" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(1)

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(
        /"cm_link_1"\."pricing_tier_id" = "pricing_tier"\."id"/
      )
      expect(existsSql).toMatch(
        /"cm_link_2"\."functionality_id" = "functionality"\."id"/
      )
      expect(existsSql).toMatch(/"permission"\."code" = \?/)
      expect(existsSql.match(/exists \(select 1 from/g)?.length).toBe(3)
    })

    it("should not emit a top-level exists for parent-only joins", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
              {
                alias: "functionality",
                parent: "pricing_tier",
                link: {
                  table: "tier_functionality_link",
                  sourceKey: "pricing_tier_id",
                  targetKey: "functionality_id",
                },
                target: {
                  table: "functionality_entity",
                  filters: { handle: "billing" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toHaveLength(1)
    })

    it("should throw on unknown parent references", () => {
      expect(() =>
        augmentFindOptionsWithCrossModuleJoins(
          {
            where: {},
            options: {
              __internal: { crossModuleJoins:[
                {
                  alias: "functionality",
                  parent: "missing_parent",
                  link: {
                    table: "tier_functionality_link",
                    sourceKey: "pricing_tier_id",
                    targetKey: "functionality_id",
                  },
                  target: {
                    table: "functionality_entity",
                    filters: { handle: "billing" },
                  },
                },
              ],
},
            },
          },
          { primaryKey: "id", entityName: "CustomerEntity" }
        )
      ).toThrow(/unknown parent/)
    })

    it("should not add a where clause for joins without target filters", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: { email: "alice@example.com" } as any,
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      expect(result.where?.$and).toBeUndefined()
      expect(result.where).toEqual({ email: "alice@example.com" })
    })

    it("should apply soft-delete guards by default", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"deleted_at" is null/)
      expect(existsSql).toMatch(/"pricing_tier"\."handle" = \?/)
    })

    it("should drop soft-delete guards when the query runs with withDeleted", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            filters: { softDeletable: { withDeleted: true } },
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).not.toMatch(/deleted_at/)
      expect(existsSql).toMatch(/"pricing_tier"\."handle" = \?/)
    })

    it("should still guard soft-deletes when withDeleted is not requested", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            // softDeletable enabled but without withDeleted -> guards stay on.
            filters: { softDeletable: true },
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                  filters: { handle: "premium" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
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
            __internal: { crossModuleJoins:[
              {
                alias: "customer",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "pricing_tier_id",
                  targetKey: "customer_id",
                },
                target: {
                  table: "customer_entity",
                  filters: { email: "a@example.com" },
                },
              },
            ],
},
          },
        },
        { primaryKey: "id", entityName: "PricingTierEntity" }
      )

      const existsSql = Object.keys(
        (result.where?.$and as Record<string, unknown>[])[0]
      )[0]

      expect(existsSql).toMatch(/"p0"\."id"/)
    })

    it("should not mutate the caller's find options", () => {
      const crossModuleJoins = [
        {
          alias: "pricing_tier",
          link: {
            table: "customer_pricing_tier_link",
            sourceKey: "customer_id",
            targetKey: "pricing_tier_id",
          },
          target: {
            table: "pricing_tier_entity",
            filters: { handle: "premium" },
          },
        },
      ]
      const input = {
        where: { email: "alice@example.com" } as any,
        options: { __internal: { crossModuleJoins } },
      }

      augmentFindOptionsWithCrossModuleJoins(input, {
        primaryKey: "id",
        entityName: "CustomerEntity",
      })

      // Original input must remain untouched so retries/re-use are safe.
      expect(input.options.__internal?.crossModuleJoins).toBe(crossModuleJoins)
      expect(input.where).toEqual({ email: "alice@example.com" })
    })

    it("should translate cross-module order keys into scalar subqueries", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
            ],
},
            orderBy: {
              "pricing_tier.handle": "ASC",
            },
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["pricing_tier.handle"]).toBeUndefined()
      expect(Object.keys(orderBy)).toHaveLength(1)
      expect(Object.values(orderBy)[0]).toBe("ASC")

      const orderSql = Object.keys(orderBy)[0]

      expect(orderSql).toMatch(
        /\(select "pricing_tier"\."handle" from "public"\."customer_pricing_tier_link"/
      )
      expect(orderSql).toMatch(/"cm_order_link_0"\."customer_id" = "c0"\."id"/)
      expect(orderSql).toMatch(/order by "pricing_tier"\."id" limit 1\)/)
    })

    it("should throw on duplicate join aliases", () => {
      expect(() =>
        augmentFindOptionsWithCrossModuleJoins(
          {
            where: {},
            options: {
              __internal: { crossModuleJoins:[
                {
                  alias: "pricing_tier",
                  link: {
                    table: "customer_pricing_tier_link",
                    sourceKey: "customer_id",
                    targetKey: "pricing_tier_id",
                  },
                  target: { table: "pricing_tier_entity" },
                },
                {
                  alias: "pricing_tier",
                  link: {
                    table: "customer_pricing_tier_link_2",
                    sourceKey: "customer_id",
                    targetKey: "pricing_tier_id",
                  },
                  target: { table: "pricing_tier_entity_2" },
                },
              ],
},
            },
          },
          { primaryKey: "id", entityName: "CustomerEntity" }
        )
      ).toThrow(/Duplicate cross-module join alias/)
    })

    it("should leave non-cross-module order keys untouched", () => {
      const result = augmentFindOptionsWithCrossModuleJoins(
        {
          where: {},
          options: {
            __internal: { crossModuleJoins:[
              {
                alias: "pricing_tier",
                link: {
                  table: "customer_pricing_tier_link",
                  sourceKey: "customer_id",
                  targetKey: "pricing_tier_id",
                },
                target: {
                  table: "pricing_tier_entity",
                },
              },
            ],
},
            orderBy: {
              created_at: "DESC",
              "pricing_tier.handle": "ASC",
            },
          },
        },
        { primaryKey: "id", entityName: "CustomerEntity" }
      )

      const orderBy = result.options?.orderBy as Record<string, unknown>
      expect(orderBy["created_at"]).toBe("DESC")
      expect(Object.keys(orderBy)).toHaveLength(2)
    })
  })
})
