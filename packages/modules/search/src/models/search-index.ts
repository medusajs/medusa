import { model } from "@medusajs/framework/utils"
import { SearchIndexState } from "../utils"
import { SearchIndexSync } from "./search-index-sync"

export const SearchIndex = model
  .define("SearchIndex", {
    id: model.id({ prefix: "srhidx" }).primaryKey(),
    // The index name, as used in `query.search({ entity })`.
    // For now we expect the index and entity names to match.
    name: model.text(),
    // The identifier of the provider backing this index.
    provider: model.text(),
    status: model.enum(SearchIndexState).default(SearchIndexState.PENDING),
    // Used to detect schema drift
    definition_hash: model.text(),
    // Append-only history of every sync run against this index.
    syncs: model.hasMany(() => SearchIndexSync, { mappedBy: "search_index" }),
  })
  .indexes([
    {
      name: "IDX_search_index_name",
      on: ["name"],
      unique: true,
    },
  ])
