const __type = "QueryFilter"
export function QueryFilter(query: Record<string, unknown>) {
  return {
    ...query,
    __type,
  }
}

QueryFilter.isQueryFilter = (obj: any) => {
  return obj.__type === __type
}
