"use client"

import { capitalize } from "docs-ui"
import { useArea } from "../../providers/area"
import { useVersion } from "../../providers/version"

type PageHeadingProps = {
  className?: string
}

const PageHeading = ({ className }: PageHeadingProps) => {
  const { area } = useArea()
  const { version, isVersioningEnabled } = useVersion()

  const versionText = isVersioningEnabled ? ` V${version}` : ""

  return (
    <h1 className={className}>
      Medusa{versionText} {capitalize(area)} API Reference
    </h1>
  )
}

export default PageHeading
