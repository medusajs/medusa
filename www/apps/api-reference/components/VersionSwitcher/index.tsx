"use client"

import { Toggle } from "docs-ui"
import clsx from "clsx"
import { usePathname } from "next/navigation"

const VersionSwitcher = () => {
  const pathname = usePathname()

  return (
    <div className="flex gap-0.5 justify-center items-center">
      <span className={clsx("text-medusa-fg-disabled")}>V1</span>
      <Toggle
        checked={true}
        onCheckedChange={() => {
          location.href = process.env.NEXT_PUBLIC_API_V1_URL + pathname
        }}
      />
      <span className={clsx("text-medusa-fg-subtle")}>V2</span>
    </div>
  )
}

export default VersionSwitcher
