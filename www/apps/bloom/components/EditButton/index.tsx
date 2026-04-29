"use client"

import { EditButton as UiEditButton } from "docs-ui"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const EditButton = () => {
  const pathname = usePathname()
  const [editDate, setEditDate] = useState<string | undefined>()

  const loadEditDate = useCallback(async () => {
    const generatedEditDates = (await import("../../generated/edit-dates.mjs"))
      .generatedEditDates
    setEditDate(
      (generatedEditDates as Record<string, string>)[
        `app${pathname.replace(/\/$/, "")}/page.mdx`
      ]
    )
  }, [pathname])

  useEffect(() => {
    void loadEditDate()
  }, [loadEditDate])

  if (!editDate) {
    return <></>
  }

  return (
    <UiEditButton
      filePath={`/www/apps/bloom/app${pathname.replace(/\/$/, "")}/page.mdx`}
      editDate={editDate}
    />
  )
}

export default EditButton
