import React, { useEffect, useState } from "react"
import Redoc from "@theme-original/Redoc"
import type RedocType from "@theme-original/Redoc"
import type { WrapperProps } from "@docusaurus/types"
import useIsBrowser from "@docusaurus/useIsBrowser"

type Props = WrapperProps<typeof RedocType>

export default function RedocWrapper(props: Props): JSX.Element {
  const isBrowser = useIsBrowser()
  const [loading, setLoading] = useState(
    isBrowser ? document.readyState !== "complete" : true
  )

  useEffect(() => {
    if (isBrowser) {
      // redocusaurus in dark mode displays styling wrong
      // until the issue is resolved, this is a work around to hide
      // the bad styling
      window.onload = function () {
        setLoading(false)
      }

      // fallback in case the onload function does not execute
      setTimeout(() => {
        if (loading) {
          setLoading(false)
        }
      }, 1000)

      const scrollHandler = () => {
        const redocSidebar = document.querySelector(
          ".redocusaurus .menu-content"
        ) as HTMLElement
        const navbar = document.querySelector(".navbar") as HTMLElement
        if (!redocSidebar || !navbar) {
          return
        }

        let offset = navbar.clientHeight
        // @ts-expect-error: error for entries
        for (const [, className] of navbar.classList.entries()) {
          if (className.indexOf("navbarHidden") !== -1) {
            offset = 0
            break
          }
        }

        redocSidebar.style.top = `${offset}px`
      }

      window.addEventListener("scroll", scrollHandler)

      return () => {
        window.removeEventListener("scroll", scrollHandler)
      }
    }
  }, [isBrowser])

  return (
    <div
      style={{
        opacity: loading ? 0 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <Redoc {...props} />
    </div>
  )
}
