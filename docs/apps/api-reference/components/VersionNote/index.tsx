"use client"

import { Note } from "docs-ui"
import { useVersion } from "../../providers/version"

const VersionNote = () => {
  const { version } = useVersion()

  return (
    <>
      {version === "2" && (
        <Note type="warning" title="Production Warning">
          Medusa v2.0 is in development and not suitable for production
          environments. As such, the API reference is incomplete and subject to
          change, so please use it with caution.
        </Note>
      )}
    </>
  )
}

export default VersionNote
