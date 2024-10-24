"use state"

import React, { useEffect, useMemo, useState } from "react"
import { useIsBrowser, useSiteConfig } from "../../../providers"
import Link from "next/link"
import { Tooltip } from "../../Tooltip"
import clsx from "clsx"

const LOCAL_STORAGE_SUFFIX = "-seen"

export const MainNavVersion = () => {
  const {
    config: { version },
  } = useSiteConfig()
  const [showNewBadge, setShowNewBadge] = useState(false)
  const { isBrowser } = useIsBrowser()
  const localStorageKey = useMemo(
    () => `${version.number}${LOCAL_STORAGE_SUFFIX}`,
    [version]
  )

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    if (!localStorage.getItem(localStorageKey)) {
      setShowNewBadge(true)
    }
  }, [isBrowser, localStorageKey])

  const afterHover = () => {
    if (!showNewBadge) {
      return
    }

    setShowNewBadge(false)
    localStorage.setItem(localStorageKey, "true")
  }

  return (
    <>
      <Link href={version.releaseUrl} target="_blank">
        <Tooltip html="View the release notes<br/>on GitHub">
          <span
            className="relative text-compact-small-plus"
            onMouseOut={afterHover}
          >
            <span>v{version.number}</span>
            {showNewBadge && (
              <span
                className={clsx(
                  "bg-medusa-tag-blue-icon w-[10px] h-[10px]",
                  "absolute -top-docs_0.25 -right-docs_0.5",
                  "animate-pulse rounded-full"
                )}
              ></span>
            )}
          </span>
        </Tooltip>
      </Link>
      <span className="text-compact-small">&#183;</span>
    </>
  )
}
