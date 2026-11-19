import { FlagSettings } from "@medusajs/framework/feature-flags"

/**
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
const IndexEngineFeatureFlag: FlagSettings = {
  key: "index_engine",
  default_val: false,
  env_key: "MEDUSA_FF_INDEX_ENGINE",
  description:
    "[Deprecated] Enable Medusa to use the index engine in some part of the core. Use query.graph() to filter by linked data models instead: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property",
}

export default IndexEngineFeatureFlag
