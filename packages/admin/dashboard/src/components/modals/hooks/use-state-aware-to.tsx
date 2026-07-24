import { useMemo } from "react"
import { Path, useLocation } from "react-router-dom"

/**
 * Checks if the current location has a restore_params property.
 * If it does, it will return a new path with the params added to it.
 * Otherwise, it will check if the current location has search params and preserve them.
 * Otherwise, it will return the previous path.
 *
 * This is useful if the modal needs to return to the original path, with
 * the params that were present when the modal was opened.
 */
export const useStateAwareTo = (prev: string | Partial<Path> | number) => {
  const location = useLocation()

  const to = useMemo(() => {
    if (typeof prev === "number") {
      return prev
    }

    const params = location.state?.restore_params

    if (params) {
      return `${prev}?${params.toString()}`
    }

    // If no restore_params in state, check if the current URL has search params
    if (location.search) {
      return `${prev}${location.search}`
    }

    return prev
  }, [location.state, location.search, prev])

  return to
}
