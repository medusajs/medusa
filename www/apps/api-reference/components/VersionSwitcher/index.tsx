"use client"

import { Toggle } from "docs-ui"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { useVersion } from "../../providers/version"

const VersionSwitcher = () => {
  const pathname = usePathname()
  const { version } = useVersion()

  return (
    <div className="flex gap-0.5 justify-center items-center">
      <span
        className={clsx(
          version === "1" && "text-medusa-fg-subtle",
          version === "2" && "text-medusa-fg-disabled"
        )}
      >
        V1
      </span>
      <Toggle
        checked={version === "2"}
        onCheckedChange={(checked) => {
          let newPath = pathname.replace("/v2", "")
          if (checked) {
            newPath += `/v2`
          }

          location.href = location.href.replace(pathname, newPath)
        }}
      />
      <span
        className={clsx(
          version === "1" && "text-medusa-fg-disabled",
          version === "2" && "text-medusa-fg-subtle"
        )}
      >
        V2
      </span>
    </div>
  )
}

export default VersionSwitcher
