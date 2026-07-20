import { ModuleJoinerConfig } from "@medusajs/types"
import { toRemoteQuery } from "../../query/to-remote-query"
import { toRemoteJoinerQuery } from "../../query/to-remote-joiner-query"
import { crossModuleJoinerConfigs } from "../__fixtures__/cross-module-joins"
import { GraphCatalog } from "../catalog"
import { compileQuery } from "../compile"
import { executePlan } from "../execute"
import { IRemoteDataFetcher } from "../types"
import {
  matchesFilters,
  matchesResidualFilter,
} from "../residual-filters"

describe("matchesFilters (stage 2 in-memory)", () => {
  it("matches equality, operators, and nested relations", () => {
    expect(matchesFilters({ id: "a", amount: 10 }, { id: "a" })).toBe(true)
    expect(matchesFilters({ amount: 150 }, { amount: { $gt: 100 } })).toBe(
      true
    )
    expect(matchesFilters({ amount: 50 }, { amount: { $gt: 100 } })).toBe(
      false
    )
    expect(
      matchesFilters(
        { prices: [{ amount: 10 }, { amount: 20 }] },
        { prices: { amount: 20 } }
      )
    ).toBe(true)
    expect(
      matchesFilters(
        { currency_code: "usd" },
        { currency_code: { $fulltext: "us" } }
      )
    ).toBe(true)
  })

  it("matches residual filters against a joined root row", () => {
    expect(
      matchesResidualFilter(
        {
          id: "var_1",
          price_set: { calculated_price: 150 },
        },
        {
          path: "price_set",
          filters: { calculated_price: { $gt: 100 } },
        }
      )
    ).toBe(true)

    expect(
      matchesResidualFilter(
        {
          id: "var_1",
          price_set: { calculated_price: 50 },
        },
        {
          path: "price_set",
          filters: { calculated_price: { $gt: 100 } },
        }
      )
    ).toBe(false)

    expect(
      matchesResidualFilter(
        {
          id: "cart_1",
          items: [
            { product: { handle: "pants" } },
            { product: { handle: "shirt" } },
          ],
        },
        {
          path: "items.product",
          filters: { handle: "shirt" },
        }
      )
    ).toBe(true)
  })
})

describe("executePlan residual cross-module filtering (stage 2)", () => {
  const catalog = new GraphCatalog(crossModuleJoinerConfigs, {
    autoCreateServiceNameAlias: false,
  })

  const variants = [
    { id: "var_cheap", title: "Cheap" },
    { id: "var_mid", title: "Mid" },
    { id: "var_pricey", title: "Pricey" },
    { id: "var_other", title: "Other" },
  ]

  const priceSets = [
    { id: "pset_cheap", calculated_price: 50, currency_code: "usd" },
    { id: "pset_mid", calculated_price: 150, currency_code: "usd" },
    { id: "pset_pricey", calculated_price: 250, currency_code: "eur" },
    { id: "pset_other", calculated_price: 175, currency_code: "usd" },
  ]

  const links = [
    { variant_id: "var_cheap", price_set_id: "pset_cheap" },
    { variant_id: "var_mid", price_set_id: "pset_mid" },
    { variant_id: "var_pricey", price_set_id: "pset_pricey" },
    { variant_id: "var_other", price_set_id: "pset_other" },
  ]

  const backupLinks = [
    { variant_id: "var_cheap", price_set_id: "pset_other" },
    { variant_id: "var_mid", price_set_id: "pset_mid" },
    { variant_id: "var_pricey", price_set_id: "pset_cheap" },
    { variant_id: "var_other", price_set_id: "pset_pricey" },
  ]

  const createFetcher = (): IRemoteDataFetcher => ({
    fetch: async (expand, keyField, ids) => {
      const service = expand.serviceConfig.serviceName
      const entity = expand.entity
      const idList = ids
        ? Array.isArray(ids)
          ? ids.flat()
          : [ids]
        : undefined

      if (service === "product" && entity === "ProductVariant") {
        let rows = variants.map((v) => ({ ...v }))
        if (idList?.length) {
          rows = rows.filter((row) => idList.includes(row.id))
        }
        // Honour stage-1 cross-module joins when present on __internal.
        const internal = expand.args?.find((arg) => arg.name === "__internal")
          ?.value as { crossModuleJoins?: any[] } | undefined
        for (const join of internal?.crossModuleJoins ?? []) {
          const joinFilters = join?.target?.filters
          if (!joinFilters) {
            continue
          }
          if (joinFilters.id) {
            const allowed = new Set(
              links
                .filter((link) => link.price_set_id === joinFilters.id)
                .map((link) => link.variant_id)
            )
            rows = rows.filter((row) => allowed.has(row.id))
          }
          if (joinFilters.currency_code) {
            const matchingPriceSets = new Set(
              priceSets
                .filter((ps) => ps.currency_code === joinFilters.currency_code)
                .map((ps) => ps.id)
            )
            const allowed = new Set(
              links
                .filter((link) => matchingPriceSets.has(link.price_set_id))
                .map((link) => link.variant_id)
            )
            rows = rows.filter((row) => allowed.has(row.id))
          }
        }
        return { data: rows }
      }

      if (service === "link-product-variant-price-set") {
        let rows = links.map((l) => ({ ...l }))
        if (idList?.length && keyField) {
          rows = rows.filter((row) => idList.includes((row as any)[keyField]))
        }
        return { data: rows }
      }

      if (service === "link-product-variant-backup-price-set") {
        let rows = backupLinks.map((l) => ({ ...l }))
        if (idList?.length && keyField) {
          rows = rows.filter((row) => idList.includes((row as any)[keyField]))
        }
        return { data: rows }
      }

      if (service === "pricing") {
        let rows = priceSets.map((ps) => ({ ...ps }))
        if (idList?.length && keyField) {
          rows = rows.filter((row) => idList.includes((row as any)[keyField]))
        }
        return { data: rows }
      }

      return { data: [] }
    },
  })

  const run = async (
    graphInput: Parameters<typeof toRemoteQuery>[0],
    configs: ModuleJoinerConfig[] = crossModuleJoinerConfigs
  ) => {
    const query = toRemoteJoinerQuery(toRemoteQuery(graphInput, configs))
    const serviceConfig = catalog.getServiceConfig({
      serviceAlias: query.alias,
      serviceName: query.service,
    })!

    const plan = compileQuery(
      { query, serviceConfig, options: undefined, initialData: [] },
      catalog
    )

    return executePlan({
      plan,
      dataFetcher: createFetcher(),
      catalog,
    })
  }

  it("filters root rows in memory for residual-only filters", async () => {
    const { data } = await run({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { calculated_price: { $gt: 100 } },
      },
    })

    expect(data.map((row: any) => row.id).sort()).toEqual([
      "var_mid",
      "var_other",
      "var_pricey",
    ])
  })

  it("applies multiple residual field conditions in memory", async () => {
    const { data } = await run({
      entity: "variant",
      fields: ["id", "title", "price_set.id"],
      filters: {
        price_set: {
          currency_code: "usd",
          calculated_price: { $gte: 150 },
        },
      },
    })

    // usd + calculated_price >= 150 → mid (150) and other (175), not cheap (50)
    expect(data.map((row: any) => row.id).sort()).toEqual([
      "var_mid",
      "var_other",
    ])
  })

  it("combines stage-1 pushdown with a residual filter on another path", async () => {
    // price_set.id is pushed to SQL; backup_price_set.calculated_price is
    // residual (same target table already used + computed field).
    const { data, plan } = await (async () => {
      const query = toRemoteJoinerQuery(
        toRemoteQuery(
          {
            entity: "variant",
            fields: ["id", "title"],
            filters: {
              price_set: { id: "pset_mid" },
              backup_price_set: { calculated_price: { $gt: 100 } },
            },
          },
          crossModuleJoinerConfigs
        )
      )
      const serviceConfig = catalog.getServiceConfig({
        serviceAlias: query.alias,
        serviceName: query.service,
      })!
      const compiled = compileQuery(
        { query, serviceConfig, options: undefined, initialData: [] },
        catalog
      )
      const result = await executePlan({
        plan: compiled,
        dataFetcher: createFetcher(),
        catalog,
      })
      return { ...result, plan: compiled }
    })()

    expect(plan.crossModuleJoins).toHaveLength(1)
    expect(plan.residualCrossModuleFilters).toEqual([
      {
        path: "backup_price_set",
        filters: { calculated_price: { $gt: 100 } },
      },
    ])

    // Stage 1 keeps only var_mid; backup of mid is pset_mid (150) which matches.
    expect(data.map((row: any) => row.id)).toEqual(["var_mid"])
  })

  it("applies pagination after in-memory residual filtering", async () => {
    const result = await run({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { calculated_price: { $gt: 100 } },
      },
      pagination: {
        skip: 1,
        take: 1,
      },
    })

    expect(result.responsePath).toBe("rows")
    expect(result.data).toHaveLength(1)
    expect((result.rawResponse.data as any).metadata).toEqual({
      skip: 1,
      take: 1,
      count: 3,
    })
  })

  it("returns unfiltered results when there are no residuals", async () => {
    const { data, responsePath } = await run({
      entity: "variant",
      fields: ["id", "title"],
      filters: {
        price_set: { id: "pset_mid" },
      },
    })

    expect(responsePath).toBeUndefined()
    expect(data.map((row: any) => row.id)).toEqual(["var_mid"])
  })
})
