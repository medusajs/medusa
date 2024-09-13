type QueryContextType = {
  (query: Record<string, unknown>): Record<string, unknown>
  isQueryContext: (obj: any) => boolean
}

const __type = "QueryContext"

function QueryContextFn(query: Record<string, unknown>) {
  return {
    ...query,
    __type,
  }
}

QueryContextFn.isQueryContext = (obj: any) => {
  return obj.__type === __type
}

export const QueryContext: QueryContextType = QueryContextFn
