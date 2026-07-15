import {
  CrossModuleJoinSpec,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { toRemoteQuery } from "../../query/to-remote-query"
import { toRemoteJoinerQuery } from "../../query/to-remote-joiner-query"
import { crossModuleJoinerConfigs } from "../__fixtures__/cross-module-joins"
import { GraphCatalog } from "../catalog"
import { compileQuery } from "../compile"
import { extractCrossModuleJoins } from "../cross-module-joins"
import { QueryPlan, ResidualCrossModuleFilter } from "../types"

type RelationMap = Map<string, Map<string, string>>

const prepareQuery = (
  graphInput: Parameters<typeof toRemoteQuery>[0],
  configs: ModuleJoinerConfig[],
  relationMap?: RelationMap
) => {
  const catalog = new GraphCatalog(configs, {
    autoCreateServiceNameAlias: false,
    relationMap,
  })

  const query = toRemoteJoinerQuery(toRemoteQuery(graphInput, configs))
  const serviceConfig = catalog.getServiceConfig({
    serviceAlias: query.alias,
    serviceName: query.service,
  })!

  return { catalog, query, serviceConfig }
}

const compile = (
  graphInput: Parameters<typeof toRemoteQuery>[0],
  configs: ModuleJoinerConfig[] = crossModuleJoinerConfigs,
  relationMap?: RelationMap
): { plan: QueryPlan; query: RemoteJoinerQuery } => {
  const { catalog, query, serviceConfig } = prepareQuery(
    graphInput,
    configs,
    relationMap
  )

  const plan = compileQuery(
    { query, serviceConfig, options: undefined, initialData: [] },
    catalog
  )

  return { plan, query }
}

/**
 * Runs the extraction alone, without compile's throw-on-residual guard, so
 * residual contents and untouched filters can be asserted directly.
 */
const extract = (
  graphInput: Parameters<typeof toRemoteQuery>[0],
  configs: ModuleJoinerConfig[] = crossModuleJoinerConfigs,
  relationMap?: RelationMap
): {
  crossModuleJoins: CrossModuleJoinSpec[]
  residualCrossModuleFilters: ResidualCrossModuleFilter[]
  query: RemoteJoinerQuery
} => {
  const { catalog, query, serviceConfig } = prepareQuery(
    graphInput,
    configs,
    relationMap
  )

  const result = extractCrossModuleJoins({ query, serviceConfig }, catalog)

  return { ...result, query }
}

const getQueryArg = (query: RemoteJoinerQuery, name: string) =>
  query.args?.find((arg) => arg.name === name)

const compileJoinerQuery = (
  query: RemoteJoinerQuery,
  configs: ModuleJoinerConfig[] = crossModuleJoinerConfigs
): { plan: QueryPlan; query: RemoteJoinerQuery } => {
  const catalog = new GraphCatalog(configs, {
    autoCreateServiceNameAlias: false,
  })
  const serviceConfig = catalog.getServiceConfig({
    serviceAlias: query.alias,
    serviceName: query.service,
  })!

  const plan = compileQuery(
    { query, serviceConfig, options: undefined, initialData: [] },
    catalog
  )

  return { plan, query }
}

const getArg = (plan: QueryPlan, name: string) =>
  plan.otherArgs?.find((arg) => arg.name === name)

describe("cross-module joins (stage 1 pushdown)", () => {
  it("pushes a single-hop link filter down to the root fetch", () => {
    const { plan } = compile({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { id: "pset_1" },
      },
    })

    expect(plan.crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant_price_set",
          sourceKey: "variant_id",
          targetKey: "price_set_id",
        },
        target: {
          table: "price_set",
          primaryKey: "id",
          filters: { id: "pset_1" },
        },
      },
    ])
    expect(plan.residualCrossModuleFilters).toEqual([])

    // Attached to the root fetch args so the module DAL receives it.
    expect(getArg(plan, "__internal")?.value).toEqual({
      crossModuleJoins: plan.crossModuleJoins,
    })

    // The pushed filter is pruned from the root filters.
    expect(getArg(plan, "filters")?.value ?? {}).toEqual({})

    // No expand is fetched for the filter-only relation.
    expect(Array.from(plan.expands.keys())).toEqual(["_root"])
  })

  it("pushes an inverse-direction link filter", () => {
    const { plan } = compile({
      entity: "price_set",
      fields: ["id"],
      filters: {
        variant: { sku: "sku-1" },
      },
    })

    expect(plan.crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant_price_set",
          sourceKey: "price_set_id",
          targetKey: "variant_id",
        },
        target: {
          table: "product_variant",
          primaryKey: "id",
          filters: { sku: "sku-1" },
        },
      },
    ])
    expect(plan.residualCrossModuleFilters).toEqual([])
  })

  it("keeps the relation expand when its fields are requested", () => {
    const { plan } = compile({
      entity: "variant",
      fields: ["id", "price_set.id"],
      filters: {
        price_set: { id: "pset_1" },
      },
    })

    expect(plan.crossModuleJoins).toHaveLength(1)

    const expandPaths = Array.from(plan.expands.keys())
    expect(expandPaths).toContain("_root.price_set_link.price_set")

    // The relation fetch itself is no longer filtered: the filter now
    // restricts the root rows instead.
    const priceSetExpand = plan.expands.get("_root.price_set_link.price_set")!
    const filtersArg = priceSetExpand.args?.find(
      (arg) => arg.name === "filters"
    )
    expect(filtersArg).toBeUndefined()
  })

  it("supports operators and $and/$or groups on crossjoinable fields", () => {
    const { plan } = compile({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: {
          $or: [
            { currency_code: "usd" },
            { id: { $in: ["pset_1", "pset_2"] } },
          ],
        },
      },
    })

    expect(plan.crossModuleJoins).toHaveLength(1)
    expect(plan.crossModuleJoins![0].target.filters).toEqual({
      $or: [{ currency_code: "usd" }, { id: { $in: ["pset_1", "pset_2"] } }],
    })
    expect(plan.residualCrossModuleFilters).toEqual([])
  })

  it("reports non-crossjoinable (computed) fields as residual and leaves the filter untouched", () => {
    const { crossModuleJoins, residualCrossModuleFilters, query } = extract({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { calculated_price: { $gt: 100 } },
      },
    })

    expect(crossModuleJoins).toEqual([])
    expect(residualCrossModuleFilters).toEqual([
      {
        path: "price_set",
        filters: { calculated_price: { $gt: 100 } },
      },
    ])
    expect(getQueryArg(query, "__internal")).toBeUndefined()
    expect(getQueryArg(query, "filters")?.value).toEqual({
      price_set: { calculated_price: { $gt: 100 } },
    })
  })

  it("throws when compiling a query with residual cross-module filters", () => {
    // TODO: Becomes a passing pushdown once stage 2 (in-memory filtering)
    // consumes residual filters instead of compile rejecting them.
    expect(() =>
      compile({
        entity: "variant",
        fields: ["id"],
        filters: {
          price_set: { calculated_price: { $gt: 100 } },
        },
      })
    ).toThrow("Unsupported cross-module filter/sort paths: price_set")
  })

  it("reports unsupported operators as residual", () => {
    const { crossModuleJoins, residualCrossModuleFilters } = extract({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { currency_code: { $fulltext: "usd" } },
      },
    })

    expect(crossModuleJoins).toEqual([])
    expect(residualCrossModuleFilters).toEqual([
      {
        path: "price_set",
        filters: { currency_code: { $fulltext: "usd" } },
      },
    ])
  })

  it("leaves same-module relation filters to the module itself", () => {
    const { plan } = compile({
      entity: "product",
      fields: ["id"],
      filters: {
        variants: { sku: "sku-1" },
      },
    })

    expect(plan.crossModuleJoins).toEqual([])
    expect(plan.residualCrossModuleFilters).toEqual([])
    expect(getArg(plan, "filters")?.value).toEqual({
      variants: { sku: "sku-1" },
    })
  })

  it("chains multi-hop link filters through parent joins", () => {
    const { plan } = compileJoinerQuery({
      alias: "variant",
      fields: ["id"],
      expands: [
        {
          property: "price_set.sales_channels",
          fields: [],
          args: [{ name: "filters", value: { name: "Retail Store" } }],
        },
      ],
    })

    expect(plan.crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant_price_set",
          sourceKey: "variant_id",
          targetKey: "price_set_id",
        },
        target: {
          table: "price_set",
          primaryKey: "id",
        },
      },
      {
        parent: "price_set",
        link: {
          table: "price_set_sales_channel",
          sourceKey: "price_set_id",
          targetKey: "sales_channel_id",
        },
        target: {
          table: "sales_channel",
          primaryKey: "id",
          filters: { name: "Retail Store" },
        },
      },
    ])
    expect(plan.residualCrossModuleFilters).toEqual([])

    // Filter-only expands are dropped entirely.
    expect(Array.from(plan.expands.keys())).toEqual(["_root"])
  })

  it("pushes multi-hop filters expressed as nested filter objects", () => {
    const { plan } = compile({
      entity: "variant",
      fields: ["id", "price_set.sales_channels.id"],
      filters: {
        price_set: {
          currency_code: "usd",
          sales_channels: { name: "Retail Store" },
        },
      },
    })

    expect(plan.crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant_price_set",
          sourceKey: "variant_id",
          targetKey: "price_set_id",
        },
        target: {
          table: "price_set",
          primaryKey: "id",
          filters: { currency_code: "usd" },
        },
      },
      {
        parent: "price_set",
        link: {
          table: "price_set_sales_channel",
          sourceKey: "price_set_id",
          targetKey: "sales_channel_id",
        },
        target: {
          table: "sales_channel",
          primaryKey: "id",
          filters: { name: "Retail Store" },
        },
      },
    ])
    expect(plan.residualCrossModuleFilters).toEqual([])
  })

  it("is all-or-nothing per filter location", () => {
    const { crossModuleJoins, residualCrossModuleFilters, query } = extract({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: {
          currency_code: "usd",
          calculated_price: { $gt: 100 },
        },
      },
    })

    expect(crossModuleJoins).toEqual([])
    expect(residualCrossModuleFilters).toEqual([
      {
        path: "price_set",
        filters: {
          currency_code: "usd",
          calculated_price: { $gt: 100 },
        },
      },
    ])
    expect(getQueryArg(query, "filters")?.value).toEqual({
      price_set: {
        currency_code: "usd",
        calculated_price: { $gt: 100 },
      },
    })
  })

  it("rejects a second join to an already-used target table", () => {
    const { crossModuleJoins, residualCrossModuleFilters, query } = extract({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { id: "pset_1" },
        backup_price_set: { id: "pset_2" },
      },
    })

    expect(crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant_price_set",
          sourceKey: "variant_id",
          targetKey: "price_set_id",
        },
        target: {
          table: "price_set",
          primaryKey: "id",
          filters: { id: "pset_1" },
        },
      },
    ])
    expect(residualCrossModuleFilters).toEqual([
      {
        path: "backup_price_set",
        filters: { id: "pset_2" },
      },
    ])
    expect(getQueryArg(query, "filters")?.value).toEqual({
      backup_price_set: { id: "pset_2" },
    })
  })

  it("does not push down joins across different databases", () => {
    const configs = JSON.parse(
      JSON.stringify(crossModuleJoinerConfigs)
    ) as ModuleJoinerConfig[]

    for (const config of configs) {
      config.databaseClientUrl = "postgres://localhost/main"
    }
    configs.find(
      (config) => config.serviceName === "pricing"
    )!.databaseClientUrl = "postgres://elsewhere/pricing"

    const { crossModuleJoins, residualCrossModuleFilters } = extract(
      {
        entity: "variant",
        fields: ["id"],
        filters: {
          price_set: { id: "pset_1" },
        },
      },
      configs
    )

    expect(crossModuleJoins).toEqual([])
    expect(residualCrossModuleFilters).toEqual([
      { path: "price_set", filters: { id: "pset_1" } },
    ])
  })

  describe("module-internal and read-only link hops", () => {
    it("fuses an internal hasMany hop with a read-only link into a single spec", () => {
      const { plan } = compile({
        entity: "cart",
        fields: ["id", "email"],
        filters: {
          items: {
            product: {
              sales_channels: { name: "Retail Store" },
            },
          },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "cart_line_item",
            sourceKey: "cart_id",
            targetKey: "product_id",
          },
          target: {
            table: "product",
            primaryKey: "id",
          },
        },
        {
          parent: "product",
          link: {
            table: "product_sales_channel",
            sourceKey: "product_id",
            targetKey: "sales_channel_id",
          },
          target: {
            table: "sales_channel",
            primaryKey: "id",
            filters: { name: "Retail Store" },
          },
        },
      ])
      expect(plan.residualCrossModuleFilters).toEqual([])

      // Filter-only expands (items, items.product) are dropped entirely.
      expect(Array.from(plan.expands.keys())).toEqual(["_root"])
    })

    it("pushes filters on the read-only linked entity itself", () => {
      const { plan } = compile({
        entity: "cart",
        fields: ["id"],
        filters: {
          items: {
            product: { handle: "shirt" },
          },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "cart_line_item",
            sourceKey: "cart_id",
            targetKey: "product_id",
          },
          target: {
            table: "product",
            primaryKey: "id",
            filters: { handle: "shirt" },
          },
        },
      ])
      expect(plan.residualCrossModuleFilters).toEqual([])
    })

    it("supports read-only links directly on the root entity", () => {
      const { plan } = compile({
        entity: "cart",
        fields: ["id"],
        filters: {
          sales_channel: { name: "Retail Store" },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "cart",
            sourceKey: "id",
            targetKey: "sales_channel_id",
          },
          target: {
            table: "sales_channel",
            primaryKey: "id",
            filters: { name: "Retail Store" },
          },
        },
      ])
      expect(plan.residualCrossModuleFilters).toEqual([])
    })

    it("keeps filters on module-internal relations native", () => {
      const { plan } = compile({
        entity: "cart",
        fields: ["id"],
        filters: {
          items: { title: "Product 1" },
        },
      })

      expect(plan.crossModuleJoins).toEqual([])
      expect(plan.residualCrossModuleFilters).toEqual([])
      expect(getArg(plan, "filters")?.value).toEqual({
        items: { title: "Product 1" },
      })
    })

    it("supports inverse read-only links (join column on the target table)", () => {
      const { plan } = compile({
        entity: "sales_channel",
        fields: ["id", "name"],
        filters: {
          carts: { email: "retail-cart@test.com" },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "cart",
            sourceKey: "sales_channel_id",
            targetKey: "id",
          },
          target: {
            table: "cart",
            primaryKey: "id",
            filters: { email: "retail-cart@test.com" },
          },
        },
      ])
      expect(plan.residualCrossModuleFilters).toEqual([])
    })

    it("chains internal relations after an inverse read-only link", () => {
      // Mirrors organization -> project (inverse read-only) -> environments
      // (module-internal): deeper levels must correlate on the target's real
      // PK, not the inverse join column.
      const { plan } = compile({
        entity: "sales_channel",
        fields: ["id"],
        filters: {
          carts: {
            items: { title: "Product 1" },
          },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "cart",
            sourceKey: "sales_channel_id",
            targetKey: "id",
          },
          target: {
            table: "cart",
            primaryKey: "id",
          },
        },
        {
          parent: "cart",
          link: {
            table: "cart_line_item",
            sourceKey: "cart_id",
            targetKey: "id",
          },
          target: {
            table: "cart_line_item",
            primaryKey: "id",
            filters: { title: "Product 1" },
          },
        },
      ])
      expect(plan.residualCrossModuleFilters).toEqual([])
    })

    it("rejects read-only links whose FK prefix does not match the traversed path", () => {
      // `product` on cart resolves to the read-only link declared for line
      // items (FK `items.product_id`), which is not reachable from the root.
      const { crossModuleJoins, residualCrossModuleFilters, query } = extract({
        entity: "cart",
        fields: ["id"],
        filters: {
          product: { handle: "shirt" },
        },
      })

      expect(crossModuleJoins).toEqual([])
      expect(residualCrossModuleFilters).toEqual([
        { path: "product", filters: { handle: "shirt" } },
      ])
      expect(getQueryArg(query, "filters")?.value).toEqual({
        product: { handle: "shirt" },
      })
    })

    it("bails when the graph schema disagrees with the DML relation", () => {
      // Mirrors modules that remap relations in a custom schema (e.g.
      // order.items resolves to a different entity than the DML relation).
      const relationMap: RelationMap = new Map([
        ["Cart", new Map([["items", "SomethingElse"]])],
      ])

      const { plan, query } = compile(
        {
          entity: "cart",
          fields: ["id"],
          filters: {
            items: {
              product: { handle: "shirt" },
            },
          },
        },
        crossModuleJoinerConfigs,
        relationMap
      )

      expect(plan.crossModuleJoins).toEqual([])
      // The filter stays on the expand and keeps today's behavior.
      const productExpand = query.expands!.find(
        (expand) => expand.property === "items.product"
      )
      expect(
        productExpand?.args?.find((arg) => arg.name === "filters")?.value
      ).toEqual({ handle: "shirt" })
    })
  })

  describe("sorting", () => {
    it("rewrites cross-module order keys to the target table alias", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        pagination: {
          order: { price_set: { currency_code: "DESC" } },
        },
      })

      expect(plan.crossModuleJoins).toEqual([
        {
          link: {
            table: "product_variant_price_set",
            sourceKey: "variant_id",
            targetKey: "price_set_id",
          },
          target: {
            table: "price_set",
            primaryKey: "id",
          },
        },
      ])

      expect(getArg(plan, "order")?.value).toEqual({
        "price_set.currency_code": "DESC",
      })
    })

    it("shares the join spec between filters and sorting on the same path", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        filters: {
          price_set: { id: "pset_1" },
        },
        pagination: {
          order: { "price_set.currency_code": "asc" },
        },
      })

      expect(plan.crossModuleJoins).toHaveLength(1)
      expect(plan.crossModuleJoins![0].target.filters).toEqual({
        id: "pset_1",
      })
      expect(getArg(plan, "order")?.value).toEqual({
        "price_set.currency_code": "ASC",
      })
    })

    it("leaves non-crossjoinable sort fields untouched", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        pagination: {
          order: { price_set: { calculated_price: "DESC" } },
        },
      })

      expect(plan.crossModuleJoins).toEqual([])
      expect(getArg(plan, "order")?.value).toEqual({
        price_set: { calculated_price: "DESC" },
      })
    })

    it("leaves root-level sort fields untouched", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        pagination: {
          order: { title: "ASC" },
        },
      })

      expect(plan.crossModuleJoins).toEqual([])
      expect(getArg(plan, "order")?.value).toEqual({ title: "ASC" })
    })
  })
})
