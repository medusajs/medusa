import {
  assertIndexSupported,
  assertQuerySupported,
  buildFacetQuery,
  buildIndexPlan,
  extractPrimaryKeyFilter,
  normalizeFacetRequests,
  projectIndexedDocument,
  sameSchema,
  tableNameForIndex,
  toWhereClause,
  weightLabel,
} from "../index"
import { SearchTypes } from "@medusajs/framework/types"

const baseDefinition = (
  overrides: Partial<SearchTypes.ResolvedSearchIndexDefinition> = {}
): SearchTypes.ResolvedSearchIndexDefinition =>
  ({
    name: "product",
    entity: "product",
    primary_key: "id",
    provider: "search-postgres",
    physical_name: "product",
    definition_hash: "abc",
    settings: {},
    seed: async function* () {},
    fields: {
      id: { type: "keyword", filterable: true },
      title: { type: "text", searchable: { weight: 3 }, filterable: true },
      status: { type: "keyword", filterable: true, facetable: true },
      price: { type: "float", filterable: true, sortable: true, facetable: true },
      tags: { type: "keyword", array: true, filterable: true, facetable: true },
      sizes: { type: "integer", array: true, filterable: true },
      deleted_at: { type: "date", filterable: true },
      variants: {
        type: "object",
        array: true,
        fields: {
          color: { type: "keyword", filterable: true },
        },
      },
    },
    ...overrides,
  }) as SearchTypes.ResolvedSearchIndexDefinition

describe("postgres search utils", () => {
  describe("buildIndexPlan", () => {
    it("flattens nested object arrays into leaf paths", () => {
      const plan = buildIndexPlan(baseDefinition())

      expect(plan.searchable).toEqual(["title"])
      expect(plan.fields.has("variants.color")).toBe(true)
      expect(plan.fields.get("variants.color")?.is_array).toBe(true)
      expect(plan.fields.get("tags")?.is_array).toBe(true)
    })

    it("rejects vector and correlated fields on native", () => {
      expect(() =>
        assertIndexSupported(
          baseDefinition({
            fields: {
              embedding: { type: "vector", dimensions: 3 },
            },
          }),
          "native"
        )
      ).toThrow(/lakebase/)

      expect(() =>
        assertIndexSupported(
          baseDefinition({
            fields: {
              variants: {
                type: "object",
                array: true,
                correlated: true,
                fields: { color: { type: "keyword" } },
              },
            },
          })
        )
      ).toThrow(/correlated/)
    })

    it("allows vector fields on lakebase when dimensions are set", () => {
      expect(() =>
        assertIndexSupported(
          baseDefinition({
            fields: {
              id: { type: "keyword", filterable: true },
              embedding: { type: "vector", dimensions: 1536 },
            },
          }),
          "lakebase"
        )
      ).not.toThrow()
    })
  })

  describe("sameSchema", () => {
    it("matches plans with identical fingerprints", () => {
      const a = buildIndexPlan(baseDefinition())
      const b = buildIndexPlan(baseDefinition())
      expect(sameSchema(a, b)).toBe(true)
    })

    it("differs when searchability changes", () => {
      const a = buildIndexPlan(baseDefinition())
      const b = buildIndexPlan(
        baseDefinition({
          fields: {
            ...baseDefinition().fields,
            title: { type: "text", filterable: true },
          },
        })
      )
      expect(sameSchema(a, b)).toBe(false)
    })
  })

  describe("projectIndexedDocument", () => {
    it("collapses array-of-object leaves and builds weighted text", () => {
      const plan = buildIndexPlan(baseDefinition())
      const projected = projectIndexedDocument(
        {
          id: "prod_1",
          title: "Red shoe",
          status: "published",
          price: 49.99,
          tags: ["sale", "new"],
          variants: [{ color: "red" }, { color: "blue" }],
        },
        plan
      )

      expect(projected.id).toBe("prod_1")
      expect(projected.indexed["variants"]).toEqual({
        color: ["red", "blue"],
      })
      expect(projected.search_text).toContain("Red shoe")
      expect(projected.weighted_parts[0].weight).toBe("A")
    })
  })

  describe("toWhereClause", () => {
    it("compiles $and / $or / $not and comparisons", () => {
      const plan = buildIndexPlan(baseDefinition())
      const where = toWhereClause(
        {
          $and: [
            { status: "published" },
            {
              $or: [{ price: { $gte: 10 } }, { tags: { $overlaps: ["sale"] } }],
            },
            { $not: { status: "draft" } },
          ],
        },
        plan
      )

      expect(where?.sql).toContain("OR")
      expect(where?.sql).toContain("NOT")
      expect(where?.sql).toContain(`"indexed" @>`)
      expect(where?.params).toEqual(
        expect.arrayContaining([
          JSON.stringify({ status: "published" }),
          10,
          JSON.stringify({ tags: ["sale"] }),
          JSON.stringify({ status: "draft" }),
        ])
      )
    })

    it("treats bare equality on an array field as membership", () => {
      const plan = buildIndexPlan(baseDefinition())
      const where = toWhereClause({ tags: "sale" }, plan)

      expect(where?.sql).toBe(`"indexed" @> ?::jsonb`)
      expect(where?.params).toEqual([JSON.stringify({ tags: ["sale"] })])
    })

    it("keeps numeric array values numeric in containment", () => {
      const plan = buildIndexPlan(baseDefinition())
      const where = toWhereClause({ sizes: { $in: [38, 40] } }, plan)

      expect(where?.sql).toBe(
        `("indexed" @> ?::jsonb OR "indexed" @> ?::jsonb)`
      )
      expect(where?.params).toEqual([
        JSON.stringify({ sizes: [38] }),
        JSON.stringify({ sizes: [40] }),
      ])
    })

    it("compiles nested paths into nested containment documents", () => {
      const plan = buildIndexPlan(baseDefinition())
      const where = toWhereClause({ "variants.color": "red" }, plan)

      expect(where?.params).toEqual([
        JSON.stringify({ variants: { color: ["red"] } }),
      ])
    })

    it("parenthesizes $exists so it cannot escape the conjunction", () => {
      const plan = buildIndexPlan(baseDefinition())
      const where = toWhereClause(
        { status: "published", deleted_at: { $exists: false } },
        plan
      )

      const [, existsPart] = where!.sql.split(" AND ")
      expect(existsPart.startsWith("(")).toBe(true)
      expect(existsPart.endsWith(")")).toBe(true)
      expect(existsPart).toContain("IS NULL OR")
    })

    it("rejects range operators on array fields", () => {
      const plan = buildIndexPlan(baseDefinition())
      expect(() => toWhereClause({ tags: { $gt: "a" } }, plan)).toThrow(
        /array field/
      )
    })
  })

  describe("buildFacetQuery", () => {
    it("binds range bounds ahead of the filter params", () => {
      const plan = buildIndexPlan(baseDefinition())
      const [request] = normalizeFacetRequests(
        [
          {
            field: "price",
            type: "range",
            ranges: [{ key: "low", from: 0, to: 50 }, { key: "high", from: 50 }],
          },
        ],
        plan
      )

      const query = buildFacetQuery({
        table: "search_pg_product",
        whereSql: `"indexed" @> ?::jsonb`,
        whereParams: [JSON.stringify({ status: "published" })],
        request,
        plan,
      })

      // SELECT-list placeholders come first in the SQL text.
      expect(query.params).toEqual([
        0,
        50,
        50,
        JSON.stringify({ status: "published" }),
      ])
    })
  })

  describe("extractPrimaryKeyFilter", () => {
    it("recognises id membership", () => {
      const plan = buildIndexPlan(baseDefinition())
      expect(extractPrimaryKeyFilter({ id: ["a", "b"] }, plan)).toEqual([
        "a",
        "b",
      ])
      expect(
        extractPrimaryKeyFilter({ id: { $in: ["a"] }, status: "x" }, plan)
      ).toBeUndefined()
    })
  })

  describe("helpers", () => {
    it("maps weights and sanitises table names", () => {
      expect(weightLabel({ weight: 3 })).toBe("A")
      expect(weightLabel(true)).toBe("D")
      expect(tableNameForIndex("Product Index")).toBe("search_pg_product_index")
    })

    it("rejects unsupported query options", () => {
      expect(() =>
        assertQuerySupported({
          index: baseDefinition(),
          attributes_to_retrieve: ["id"],
          search_options: { highlight: { fields: ["title"] } },
        })
      ).toThrow(/highlight/)

      expect(() =>
        assertQuerySupported(
          {
            index: baseDefinition(),
            attributes_to_retrieve: ["id"],
            search_options: {
              vector: { field: "embedding", value: [0.1, 0.2] },
            },
          },
          "native"
        )
      ).toThrow(/lakebase/)

      expect(() =>
        assertQuerySupported({
          index: baseDefinition(),
          attributes_to_retrieve: ["id"],
          search_options: { match_strategy: "last" },
        })
      ).toThrow(/match_strategy/)

      expect(() =>
        assertQuerySupported({
          index: baseDefinition(),
          attributes_to_retrieve: ["id"],
          search_options: { match_strategy: "any" },
        })
      ).not.toThrow()
    })
  })
})
