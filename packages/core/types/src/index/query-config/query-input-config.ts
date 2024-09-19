import { ObjectToIndexFields } from "./query-input-config-fields"
import { IndexFilters } from "./query-input-config-filters"
import { IndexOrderBy } from "./query-input-config-order-by"
import { IndexServiceEntryPoints } from "../index-service-entry-points"

export type IndexQueryConfig<TEntry extends string> = {
  fields: ObjectToIndexFields<
    IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
  > extends never
    ? string[]
    : ObjectToIndexFields<
        IndexServiceEntryPoints[TEntry & keyof IndexServiceEntryPoints]
      >[]
  filters?: IndexFilters<TEntry>
  joinFilters?: IndexFilters<TEntry>
  pagination?: {
    skip?: number
    take?: number
    orderBy?: IndexOrderBy<TEntry>
  }
  keepFilteredEntities?: boolean
}
