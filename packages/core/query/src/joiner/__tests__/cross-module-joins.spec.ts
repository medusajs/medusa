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
import { RemoteJoiner } from "../remote-joiner"
import {
  IRemoteDataFetcher,
  QueryPlan,
  RemoteExpandProperty,
  ResidualCrossModuleFilter,
} from "../types"

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
 * Runs the extraction alone, without compile's residual consumption, so
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

  it("compiles residual filters for in-memory completion (stage 2)", () => {
    const { plan } = compile({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
    })

    expect(plan.crossModuleJoins).toEqual([])
    expect(plan.residualCrossModuleFilters).toEqual([
      {
        path: "price_set",
        filters: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
    ])

    // The filter is stripped from the root fetch so the module never sees it.
    expect(getArg(plan, "filters")?.value ?? {}).toEqual({})

    // The relation is loaded for evaluation through the regular expand
    // machinery, with the computed value object fetched as a child node.
    const priceSetExpand = plan.expands.get("_root.price_set_link.price_set")
    expect(priceSetExpand).toBeDefined()
    expect(priceSetExpand!.expands?.calculated_price?.fields).toEqual(["*"])

    // The synthetic relation is hidden from the returned payload.
    expect(plan.residualHiddenProperties).toEqual([
      { location: [], property: "price_set" },
    ])
  })

  it("unwraps fieldAlias-nested filters and pushes them down", () => {
    // toRemoteQuery wraps filters for fieldAliases that reach into a nested
    // relation of the linked entity under the alias name itself: the
    // `variants.prices` expand carries `filters: { prices: { ... } }`.
    // Mirrors filtering products by price list.
    const { plan } = compile({
      entity: "product",
      fields: ["id"],
      filters: {
        variants: {
          prices: { price_list_id: ["plist_1"] },
        },
      },
    })

    expect(plan.residualCrossModuleFilters).toEqual([])
    expect(plan.crossModuleJoins).toEqual([
      {
        link: {
          table: "product_variant",
          sourceKey: "product_id",
          targetKey: "id",
        },
        target: {
          table: "product_variant",
          primaryKey: "id",
        },
      },
      {
        parent: "product_variant",
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
          table: "price",
          sourceKey: "price_set_id",
          targetKey: "id",
        },
        target: {
          table: "price",
          primaryKey: "id",
          filters: { price_list_id: ["plist_1"] },
        },
      },
    ])

    // The filter-only expands are pruned entirely.
    expect(Array.from(plan.expands.keys())).toEqual(["_root"])
  })

  it("loads scalar residual conditions as select fields even when not crossjoinable", () => {
    // region_id is not in PriceSet's crossjoinable metadata (mirrors
    // belongsTo FK columns missing from it): scalar conditions must still be
    // selected as plain columns, not fetched as child value nodes.
    const { plan } = compile({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: {
          region_id: "reg_1",
          calculated_price: { $gt: 100 },
        },
      },
    })

    expect(plan.residualCrossModuleFilters).toHaveLength(1)

    const priceSetExpand = plan.expands.get("_root.price_set_link.price_set")!
    expect(priceSetExpand.fields).toEqual(
      expect.arrayContaining(["region_id", "calculated_price"])
    )
    expect(priceSetExpand.expands).toBeUndefined()
  })

  it("strips residual filters from the expand fetch they were assigned to", () => {
    const { plan } = compileJoinerQuery({
      alias: "variant",
      fields: ["id"],
      expands: [
        {
          property: "price_set",
          fields: ["id"],
          args: [
            {
              name: "filters",
              value: { calculated_price: { $gt: 100 } },
            },
          ],
        },
      ],
    })

    expect(plan.residualCrossModuleFilters).toEqual([
      {
        path: "price_set",
        filters: { calculated_price: { $gt: 100 } },
      },
    ])

    const priceSetExpand = plan.expands.get("_root.price_set_link.price_set")!
    expect(
      priceSetExpand.args?.find((arg) => arg.name === "filters")
    ).toBeUndefined()

    // The user requested price_set.id, so only the field added for
    // evaluation is hidden — not the relation itself.
    expect(plan.residualHiddenProperties).toEqual([
      { location: ["price_set"], property: "calculated_price" },
    ])
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

    it("consumes non-crossjoinable sort fields for in-memory ordering (stage 2)", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        pagination: {
          order: { price_set: { calculated_price: "DESC" } },
        },
      })

      expect(plan.crossModuleJoins).toEqual([])
      // The order arg is removed so the module never receives a path it
      // cannot sort by; the ordering is applied in memory instead.
      expect(getArg(plan, "order")).toBeUndefined()
      expect(plan.residualOrderBy).toEqual([
        {
          segments: ["price_set", "calculated_price"],
          direction: "DESC",
        },
      ])
    })

    it("moves the whole ordering in memory when any key is residual", () => {
      const { plan } = compile({
        entity: "variant",
        fields: ["id"],
        pagination: {
          order: {
            // Pushable on its own, but sort keys are lexicographically
            // significant so it moves in memory with the residual key.
            "price_set.currency_code": "ASC",
            title: "DESC",
            "price_set.calculated_price.calculated_amount": "DESC",
          },
        },
      })

      // No order-only join spec is registered.
      expect(plan.crossModuleJoins).toEqual([])
      expect(getArg(plan, "order")).toBeUndefined()
      expect(plan.residualOrderBy).toEqual([
        { segments: ["price_set", "currency_code"], direction: "ASC" },
        { segments: ["title"], direction: "DESC" },
        {
          segments: ["price_set", "calculated_price", "calculated_amount"],
          direction: "DESC",
        },
      ])

      // The root field used by the in-memory sort is loaded and hidden.
      expect(plan.root.fields).toContain("title")
      expect(plan.residualHiddenProperties).toEqual(
        expect.arrayContaining([
          { location: [], property: "title" },
          { location: [], property: "price_set" },
        ])
      )
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

describe("cross-module filtering (stage 2 in-memory residuals)", () => {
  type FetchCall = {
    service: string
    keyField: string
    ids?: unknown[]
    args: Record<string, unknown>
  }

  const variants = [
    { id: "v1", title: "Variant 1" },
    { id: "v2", title: "Variant 2" },
    { id: "v3", title: "Variant 3" },
  ]
  const links = [
    { id: "link_1", variant_id: "v1", price_set_id: "ps1" },
    { id: "link_2", variant_id: "v2", price_set_id: "ps2" },
    { id: "link_3", variant_id: "v3", price_set_id: "ps3" },
  ]
  const backupLinks = [
    { id: "blink_1", variant_id: "v1", price_set_id: "bps1" },
    { id: "blink_2", variant_id: "v2", price_set_id: "bps2" },
  ]
  // calculated_price mirrors the CalculatedPriceSet object shape computed by
  // the pricing module; region_id mirrors a column missing from the
  // crossjoinable metadata (like belongsTo FK columns).
  const priceSets = [
    { id: "ps1", currency_code: "usd", region_id: "reg_1", calculated_price: { calculated_amount: 50 } },
    { id: "ps2", currency_code: "usd", region_id: "reg_2", calculated_price: { calculated_amount: 150 } },
    { id: "ps3", currency_code: "eur", region_id: "reg_2", calculated_price: { calculated_amount: 250 } },
    { id: "bps1", currency_code: "usd", calculated_price: { calculated_amount: 10 } },
    { id: "bps2", currency_code: "usd", calculated_price: { calculated_amount: 20 } },
  ]

  const serviceData: Record<string, any[]> = {
    product: variants,
    "link-product-variant-price-set": links,
    "link-product-variant-backup-price-set": backupLinks,
    pricing: priceSets,
  }

  const createFetcher = (): {
    dataFetcher: IRemoteDataFetcher
    calls: FetchCall[]
  } => {
    const calls: FetchCall[] = []

    const dataFetcher: IRemoteDataFetcher = {
      async fetch(
        expand: RemoteExpandProperty,
        keyField: string,
        ids?: (unknown | unknown[])[]
      ) {
        const service = expand.serviceConfig.serviceName
        const args = Object.fromEntries(
          (expand.args ?? []).map((arg) => [arg.name, arg.value])
        )
        calls.push({ service, keyField, ids: ids as unknown[], args })

        let rows = (serviceData[service] ?? []).map((row) => ({ ...row }))
        if (ids) {
          const idSet = new Set((ids as unknown[]).flat())
          rows = rows.filter((row) => idSet.has(row[keyField]))
        }

        return { data: rows }
      },
    }

    return { dataFetcher, calls }
  }

  const runQuery = async (
    graphInput: Parameters<typeof toRemoteQuery>[0]
  ): Promise<{ result: any; calls: FetchCall[] }> => {
    const { dataFetcher, calls } = createFetcher()
    const joiner = new RemoteJoiner(crossModuleJoinerConfigs, dataFetcher, {
      autoCreateServiceNameAlias: false,
    })

    const query = toRemoteJoinerQuery(
      toRemoteQuery(graphInput, crossModuleJoinerConfigs)
    )

    const result = await joiner.query(query)
    return { result, calls }
  }

  it("filters root rows in memory and hides the synthetic relation", async () => {
    const { result } = await runQuery({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
    })

    expect(result.map((row) => row.id)).toEqual(["v2", "v3"])
    // The price_set relation was loaded only for evaluation and is hidden.
    expect(JSON.parse(JSON.stringify(result[0]))).toEqual({
      id: "v2",
      title: "Variant 2",
    })
  })

  it("keeps requested fields on the residual path and hides only added ones", async () => {
    const { result } = await runQuery({
      entity: "variant",
      fields: ["id", "price_set.id"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
    })

    expect(result.map((row) => row.id)).toEqual(["v2", "v3"])
    expect(JSON.parse(JSON.stringify(result[0].price_set))).toEqual({
      id: "ps2",
    })
  })

  it("filters by residual scalar conditions on non-crossjoinable columns", async () => {
    const { result } = await runQuery({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { region_id: "reg_2" },
      },
    })

    expect(result.map((row) => row.id)).toEqual(["v2", "v3"])
  })

  it("combines stage-1 pushdown with in-memory residuals", async () => {
    const { result, calls } = await runQuery({
      entity: "variant",
      fields: ["id"],
      filters: {
        // Pushable: becomes a cross-module join on the root fetch.
        price_set: { currency_code: "usd" },
        // Residual: second join to the same target table is rejected.
        backup_price_set: { id: "bps1" },
      },
    })

    const rootCall = calls.find((call) => call.service === "product")!
    expect(rootCall.args.__internal).toEqual({
      crossModuleJoins: [
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
      ],
    })
    // The residual filter never reaches a module fetch.
    expect(rootCall.args.filters ?? {}).toEqual({})

    expect(result.map((row) => row.id)).toEqual(["v1"])
    expect(JSON.parse(JSON.stringify(result[0]))).toEqual({ id: "v1" })
  })

  it("applies pagination after in-memory filtering and reports the filtered count", async () => {
    const { result, calls } = await runQuery({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
      pagination: { skip: 1, take: 1 },
    })

    // Pagination is moved off the root fetch so all candidate rows load.
    const rootCall = calls.find((call) => call.service === "product")!
    expect(rootCall.args.skip).toBeUndefined()
    expect(rootCall.args.take).toBeUndefined()

    expect(result.metadata).toEqual({ skip: 1, take: 1, count: 2 })
    expect(result.rows.map((row) => row.id)).toEqual(["v3"])
  })

  it("applies take-only pagination after in-memory filtering", async () => {
    const { result } = await runQuery({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
      pagination: { take: 1 },
    })

    // No skip means no pagination envelope, matching the SQL-only path.
    expect(Array.isArray(result)).toBe(true)
    expect(result.map((row) => row.id)).toEqual(["v2"])
  })

  it("sorts by a residual cross-module field in memory", async () => {
    const { result, calls } = await runQuery({
      entity: "variant",
      fields: ["id"],
      pagination: {
        order: {
          price_set: { calculated_price: { calculated_amount: "DESC" } },
        },
      },
    })

    // The order arg never reaches the root fetch.
    const rootCall = calls.find((call) => call.service === "product")!
    expect(rootCall.args.order).toBeUndefined()

    expect(result.map((row) => row.id)).toEqual(["v3", "v2", "v1"])
    // The relation was loaded only for sorting and is hidden.
    expect(JSON.parse(JSON.stringify(result[0]))).toEqual({ id: "v3" })
  })

  it("interleaves pushable, root, and residual sort keys in memory", async () => {
    const { result, calls } = await runQuery({
      entity: "variant",
      fields: ["id"],
      pagination: {
        order: {
          // eur < usd, then amount DESC within the same currency.
          "price_set.currency_code": "ASC",
          "price_set.calculated_price.calculated_amount": "DESC",
        },
      },
    })

    // No order-only join spec is pushed down.
    const rootCall = calls.find((call) => call.service === "product")!
    expect(rootCall.args.__internal).toBeUndefined()
    expect(rootCall.args.order).toBeUndefined()

    expect(result.map((row) => row.id)).toEqual(["v3", "v2", "v1"])
  })

  it("filters, sorts, and paginates residuals in memory together", async () => {
    const { result } = await runQuery({
      entity: "variant",
      fields: ["id"],
      filters: {
        price_set: { calculated_price: { calculated_amount: { $gt: 100 } } },
      },
      pagination: {
        order: {
          price_set: { calculated_price: { calculated_amount: "ASC" } },
        },
        skip: 1,
        take: 1,
      },
    })

    // Filtered set is [v2, v3] ascending; page 2 of size 1 is v3.
    expect(result.metadata).toEqual({ skip: 1, take: 1, count: 2 })
    expect(result.rows.map((row) => row.id)).toEqual(["v3"])
  })

  it("keeps the paginated envelope untouched when no residuals exist", async () => {
    const { result, calls } = await runQuery({
      entity: "variant",
      fields: ["id"],
      pagination: { skip: 0, take: 2 },
    })

    // Without residuals the pagination args stay on the root fetch; the mock
    // fetcher ignores them, so all rows come back as a plain list.
    const rootCall = calls.find((call) => call.service === "product")!
    expect(rootCall.args.skip).toEqual(0)
    expect(rootCall.args.take).toEqual(2)
    expect(result.map((row) => row.id)).toEqual(["v1", "v2", "v3"])
  })
})
