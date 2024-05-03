"use client"

import { Toggle } from "docs-ui"
import { useVersion } from "../../providers/version"
import clsx from "clsx"

const VersionSwitcher = () => {
  const { version, changeVersion } = useVersion()

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
        onCheckedChange={(checked) => changeVersion(checked ? "2" : "1")}
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
