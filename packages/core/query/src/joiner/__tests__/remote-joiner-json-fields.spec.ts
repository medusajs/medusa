import { ModuleJoinerConfig, RemoteExpandProperty } from "@medusajs/types"
import { IRemoteDataFetcher, RemoteJoiner, RelationMap } from ".."
import { getAllFieldsAndRelations } from "../../query/module-data-fetcher"

// A single queryable module whose entity exposes a JSON `metadata` column and
// a real `options` relation. `metadata` is intentionally NOT part of the
// relationMap (it is a scalar/JSON column, not a relation), mirroring what
// GraphQLUtils.extractRelationsFromGQL produces.
const serviceConfigs: ModuleJoinerConfig[] = [
  {
    serviceName: "product",
    entity: "Product",
    primaryKeys: ["id"],
    alias: [{ name: "product", entity: "Product" }],
    relationships: [],
  },
]

const relationMap: RelationMap = new Map([
  ["Product", new Map([["options", "ProductOption"]])],
])

type FetchInfo = { select?: string[]; relations: string[] }

/**
 * Data fetcher that mimics a MikroORM-backed module service: the JSON
 * `metadata` column is only returned when its exact column name is part of the
 * requested `select`, while real relations are returned when populated.
 */
function createFetcher(): {
  fetcher: IRemoteDataFetcher
  rootInfo: () => FetchInfo | undefined
} {
  let rootInfo: FetchInfo | undefined

  const fetcher: IRemoteDataFetcher = {
    fetch: async (
      expand: RemoteExpandProperty,
      _keyField: string,
      ids?: (unknown | unknown[])[]
    ) => {
      const info = getAllFieldsAndRelations(expand)
      rootInfo ??= info

      const select = info.select
      const relations = info.relations ?? []
      const selectAll = select === undefined

      const record: any = {
        id: (Array.isArray(ids) ? ids[0] : ids) ?? "prod_1",
        handle: "shirts",
      }

      if (selectAll || (select ?? []).includes("metadata")) {
        record.metadata = { test: "testval" }
      }

      if (selectAll || relations.includes("options")) {
        record.options = [{ id: "opt_1", title: "Size" }]
      }

      return { data: [record] }
    },
  }

  return { fetcher, rootInfo: () => rootInfo }
}

describe("RemoteJoiner - nested JSON/object column fields", () => {
  it("selects a nested property of a JSON/object column instead of dropping it", async () => {
    const { fetcher, rootInfo } = createFetcher()
    const joiner = new RemoteJoiner(serviceConfigs, fetcher, { relationMap })

    const result = await joiner.query({
      alias: "product",
      args: [{ name: "id", value: ["prod_1"] }],
      fields: ["handle"],
      expands: [{ property: "metadata", fields: ["test"] }],
    })

    // The whole JSON column is selected, not resolved as a (non-existent)
    // relation that would silently drop the value.
    expect(rootInfo()?.select).toContain("metadata")
    expect(rootInfo()?.relations).not.toContain("metadata")

    expect(result).toEqual([{ handle: "shirts", metadata: { test: "testval" } }])
  })

  it("still resolves nested access into real relations", async () => {
    const { fetcher, rootInfo } = createFetcher()
    const joiner = new RemoteJoiner(serviceConfigs, fetcher, { relationMap })

    const result = await joiner.query({
      alias: "product",
      args: [{ name: "id", value: ["prod_1"] }],
      fields: ["handle"],
      expands: [{ property: "options", fields: ["title"] }],
    })

    // A real relation must keep being populated as a relation.
    expect(rootInfo()?.relations).toContain("options")
    expect(rootInfo()?.select).not.toContain("options")

    expect(result).toEqual([
      { handle: "shirts", options: [{ title: "Size" }] },
    ])
  })
})
