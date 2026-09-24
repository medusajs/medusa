import { model } from "@medusajs/framework/utils"
import { SearchIndexState } from "../utils"
import { SearchIndex } from "./search-index"
import { SearchIndexSync } from "./search-index-sync"

/**
 * One physical index ever built for a logical `SearchIndex`. Auto-incrementing
 * per index, so `search_index.active_version` can point at whichever one
 * currently serves reads while older or still-building versions sit beside it.
 */
export const SearchIndexVersion = model
  .define("SearchIndexVersion", {
    id: model.id({ prefix: "srhver" }).primaryKey(),
    version: model.number(),
    // The identifier of the provider backing this version.
    provider: model.text(),
    // The physical index/table/namespace this version was built under.
    physical_name: model.text(),
    // Used to detect schema drift against the loaded definition.
    definition_hash: model.text(),
    status: model.enum(SearchIndexState).default(SearchIndexState.PENDING),
    search_index: model.belongsTo(() => SearchIndex, { mappedBy: "versions" }),
    syncs: model.hasMany(() => SearchIndexSync, {
      mappedBy: "search_index_version",
    }),
  })
  .indexes([
    {
      name: "IDX_search_index_version_search_index_id_version",
      on: ["search_index_id", "version"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
