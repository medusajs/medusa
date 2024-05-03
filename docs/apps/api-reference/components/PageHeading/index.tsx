"use client"

import { capitalize } from "docs-ui"
import { useArea } from "../../providers/area"
import { useVersion } from "../../providers/version"

type PageHeadingProps = {
  className?: string
}

const PageHeading = ({ className }: PageHeadingProps) => {
  const { area } = useArea()
  const { version } = useVersion()

  const versionText =
    process.env.NEXT_PUBLIC_VERSIONING === "true" ? ` V${version}` : ""

  return (
    <h1 className={className}>
      Medusa{versionText} {capitalize(area)} API Reference
    </h1>
  )
}

export default PageHeading
