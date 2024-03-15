"use client"

import { Note } from "docs-ui"
import { useVersion } from "../../providers/version"

const VersionNote = () => {
  const { version } = useVersion()

  return (
    <>
      {version === "2" && (
        <Note type="warning" title="Production Warning">
          Medusa V2 is still in development, so, the API Routes are highly
          experimental and are subject to change. The reference is also
          incomplete. We strongly advise against using it for production, at the
          moment.
        </Note>
      )}
    </>
  )
}

export default VersionNote
