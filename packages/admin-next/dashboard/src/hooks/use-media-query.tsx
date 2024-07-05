import { useEffect, useState } from "react"

export const useMediaQuery = (query: string) => {
  const mediaQuery = window.matchMedia(query)
  const [matches, setMatches] = useState(mediaQuery.matches)

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [mediaQuery])

  return matches
}
