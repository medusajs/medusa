import { RemoteQueryFilters } from "./to-remote-query"

export type QueryFilterType = {
  <TEntry extends string>(
    query: RemoteQueryFilters<TEntry>
  ): RemoteQueryFilters<TEntry> & { __type: "QueryFilter" }

  isQueryFilter: (obj: any) => boolean
}
