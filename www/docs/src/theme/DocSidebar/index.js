import OriginalDocSidebar from "@theme-original/DocSidebar"
import React from "react"

const DocSidebar = (props) => {
  return (
    <div className="sidebar-bg">
      <OriginalDocSidebar {...props} />
    </div>
  )
}

export default DocSidebar
