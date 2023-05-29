import React, { useEffect } from "react"
import SearchBar from "@theme-original/SearchBar"
import type SearchBarType from "@theme/SearchBar"
import type { WrapperProps } from "@docusaurus/types"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useLocation } from "@docusaurus/router"

type Props = WrapperProps<typeof SearchBarType>

export default function SearchBarWrapper(props: Props): JSX.Element {
  const isBrowser = useIsBrowser()
  const location = useLocation()

  useEffect(() => {
    if (isBrowser) {
      const trackSearch = (e) => {
        if (
          !e.target.classList?.contains("DocSearch-Input") &&
          !(
            e.target.tagName.toLowerCase() === "input" &&
            e.target.getAttribute("type") === "search"
          )
        ) {
          return
        }

        const query = e.target.value
        if (query.length >= 3 && window.analytics) {
          // send event to segment
          window.analytics.track("search", {
            query,
          })
        }
      }

      document.body.addEventListener("keyup", trackSearch)

      return () => {
        document.body.removeEventListener("keyup", trackSearch)
      }
    }
  }, [isBrowser, location.pathname])

  return (
    <>
      <SearchBar {...props} />
    </>
  )
}
