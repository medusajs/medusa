import { IndexInfo } from "../../../index-data"

/**
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export interface AdminIndexDetailsResponse {
  metadata: IndexInfo[]
}
