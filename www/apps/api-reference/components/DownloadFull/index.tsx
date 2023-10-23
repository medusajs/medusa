"use client"

import { NextLink } from "docs-ui"
import { useArea } from "../../providers/area"

const DownloadFull = () => {
  const { area } = useArea()

  return (
    <NextLink href={`/api/download/${area}`} download target="_blank">
      Download openapi.yaml
    </NextLink>
  )
}

export default DownloadFull
