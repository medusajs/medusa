import { model } from "@medusajs/framework/utils"
import { SearchSyncStatus } from "../utils"
import { SearchIndex } from "./search-index"

/**
 * Sync runs against one index.  Resuming an interrupted run means
 * finding this index' most recent unfinished row and picking up from its `last_key`.
 */
export const SearchIndexSync = model
  .define("SearchIndexSync", {
    id: model.id({ prefix: "srhsync" }).primaryKey(),
    // The reindex job this run belongs to. One job may span several indexes.
    job_id: model.text().nullable(),
    status: model.enum(SearchSyncStatus).default(SearchSyncStatus.PENDING),
    // Filters handed to the definition's `seed`. `null` is a full rebuild;
    // anything else records the slice this run covered.
    filters: model.json().nullable(),
    // Last primary key handed to the engine, and the resume point.
    last_key: model.text().nullable(),
    documents_synced: model.number().default(0),
    started_at: model.dateTime().nullable(),
    completed_at: model.dateTime().nullable(),
    error: model.text().nullable(),
    search_index: model.belongsTo(() => SearchIndex, { mappedBy: "syncs" }),
  })
  .indexes([
    {
      name: "IDX_search_index_sync_search_index_id",
      on: ["search_index_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_search_index_sync_job_id",
      on: ["job_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])
