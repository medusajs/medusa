"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { EditButton as UiEditButton } from "docs-ui"
import { filesMap } from "../../generated/files-map.mjs"

const EditButton = () => {
  const pathname = usePathname()
  const filePath = useMemo(
    () => filesMap.find((file) => file.pathname === pathname),
    [pathname]
  )

  if (!filePath) {
    return <></>
  }

  return <UiEditButton filePath={filePath.filePath} />
}

export default EditButton
