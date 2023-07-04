import { useEffect } from "react"

/*
 * Effect hook which reflects `queryObject` k/v in the url.
 */
function useSetSearchParams(queryObject: Record<string, string | number>) {
  useEffect(() => {
    const url = new URL(window.location.href)

    for (const k of url.searchParams.keys()) {
      if (!(k in queryObject)) {
        url.searchParams.delete(k)
      }
    }

    for (const k in queryObject) {
      url.searchParams.set(k, queryObject[k].toString())
    }

    window.history.replaceState(null, "", url.toString())
  }, [queryObject])
}

export default useSetSearchParams
