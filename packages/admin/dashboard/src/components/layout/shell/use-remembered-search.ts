import { useCallback, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

/**
 * Remembers the last search string visited for each pathname, and returns a
 * function that appends it to a pathname. This lets breadcrumb links return
 * to a list page with the filters, search, and pagination it was left with.
 */
export const useRememberedSearch = () => {
  const location = useLocation()
  const searchByPathname = useRef(new Map<string, string>())

  useEffect(() => {
    searchByPathname.current.set(location.pathname, location.search)
  }, [location.pathname, location.search])

  return useCallback(
    (pathname: string) =>
      `${pathname}${searchByPathname.current.get(pathname) ?? ""}`,
    []
  )
}
