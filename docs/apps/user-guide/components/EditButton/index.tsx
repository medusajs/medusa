"use client"

import { EditButton as UiEditButton } from "docs-ui"
import { usePathname } from "next/navigation"

const EditButton = () => {
  const pathname = usePathname()

  return (
    <UiEditButton
      filePath={`/www/apps/user-guide/app${pathname.replace(
        /\/$/,
        ""
      )}/page.mdx`}
    />
  )
}

export default EditButton
