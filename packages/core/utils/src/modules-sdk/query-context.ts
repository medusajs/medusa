const __type = "QueryContext"
export function QueryContext(query: Record<string, unknown>) {
  return {
    ...query,
    __type,
  }
}

QueryContext.isQueryContext = (obj: any) => {
  return obj.__type === __type
}
