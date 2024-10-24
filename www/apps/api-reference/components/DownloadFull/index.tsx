"use client"

import { Button } from "docs-ui"
import { useArea } from "../../providers/area"
import Link from "next/link"

const DownloadFull = () => {
  const { area } = useArea()

  return (
    <Button variant="secondary">
      <Link href={`/download/${area}`} download target="_blank">
        Download OpenApi Specs Collection
      </Link>
    </Button>
  )
}

export default DownloadFull
