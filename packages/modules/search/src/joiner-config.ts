import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"

/**
 * Nothing here is queryable or linkable — `SearchIndex` and `SearchIndexSync` are
 * the module's own bookkeeping. `models: []` has to be explicit: otherwise
 * `defineJoinerConfig` discovers `src/models` from disk and makes it all linkable,
 * whether or not the models were passed to `MedusaService`.
 */
export const joinerConfig = defineJoinerConfig(Modules.SEARCH, { models: [] })
