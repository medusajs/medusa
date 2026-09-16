"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { EditButton as UiEditButton } from "docs-ui"

const EditButton = () => {
  const pathname = usePathname()
  const [editDate, setEditDate] = useState<string | undefined>()

  const loadData = useCallback(async () => {
    const generatedEditDates = await import("../../generated/edit-dates.mjs")

    setEditDate(
      (generatedEditDates.generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ]
    )
  }, [pathname])

  useEffect(() => {
    void loadData()
  }, [loadData])

  if (!editDate) {
    return <></>
  }

  return (
    <UiEditButton
      filePath={`/www/apps/resources/app${pathname.replace(
        /\/$/,
        ""
      )}/page.mdx`}
      editDate={editDate}
    />
  )
}

export default EditButton
