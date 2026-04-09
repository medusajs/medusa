"use state"

import React from "react"
import { useSiteConfig } from "../../../providers/SiteConfig"
import Link from "next/link"
import { Tooltip } from "../../Tooltip"
import clsx from "clsx"

export const MainNavVersion = () => {
  const {
    config: { version },
  } = useSiteConfig()

  return (
    <Link
      href={version.releaseUrl}
      target="_blank"
      className={clsx(
        version.hide && "hidden",
        "px-docs_0.5 py-docs_0.25 hover:bg-medusa-button-transparent-hover rounded-docs_sm"
      )}
    >
      <Tooltip html="View the release notes<br/>on GitHub">
        <span className="relative text-compact-small-plus block">
          <span className="flex justify-center items-center">
            v{version.number}
          </span>
        </span>
      </Tooltip>
    </Link>
  )
}
