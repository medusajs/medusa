import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { useDebounce } from "./use-debounce"

/**
 * Hook for managing a debounced search param
 */
export const useDebouncedSearchParam = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [query, setQuery] = React.useState<string>(searchParams.get("q") || "")

  const debouncedQuery = useDebounce(query, 500)

  React.useEffect(() => {
    const current = new URLSearchParams(searchParams)

    if (!debouncedQuery) {
      current.delete("q")
    } else {
      current.set("q", debouncedQuery)
    }

    navigate({ search: current.toString() }, { replace: true })
  }, [debouncedQuery, searchParams, navigate])

  return {
    query,
    setQuery,
  }
}
