import { RemoteQueryFilters } from "@medusajs/types"

const __type = "QueryFilter"

export function QueryFilterFn<TEntry extends string>(
  query: RemoteQueryFilters<TEntry>
): RemoteQueryFilters<TEntry> & { __type: "QueryFilter" } {
  return {
    ...query,
    __type,
  }
}

QueryFilterFn.isQueryFilter = (obj: any) => {
  return obj.__type === __type
}

export const QueryFilter = QueryFilterFn
