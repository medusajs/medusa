import { model } from "@medusajs/framework/utils"
import { SearchIndexVersion } from "./search-index-version"

export const SearchIndex = model
  .define("SearchIndex", {
    id: model.id({ prefix: "srhidx" }).primaryKey(),
    // The index name, as used in `query.search({ entity })`.
    // For now we expect the index and entity names to match.
    name: model.text(),
    // The version number of this index's version that serves reads. `null`
    // until the first version finishes seeding.
    active_version: model.number().nullable(),
    // Every physical index ever built for this logical index, in order.
    versions: model.hasMany(() => SearchIndexVersion, {
      mappedBy: "search_index",
    }),
  })
  .indexes([
    {
      name: "IDX_search_index_name",
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
