import { QueryContextType } from "@zjedene-medusa/types"

type QueryContexFnType = {
  (query: Record<string, unknown>): Record<string, unknown>
  isQueryContext: (obj: any) => boolean
}

const __type = "QueryContext"

function QueryContextFn(query: Record<string, unknown>): QueryContextType {
  return {
    ...query,
    __type,
  }
}

QueryContextFn.isQueryContext = (obj: any) => {
  return obj.__type === __type
}

export const QueryContext: QueryContexFnType = QueryContextFn
