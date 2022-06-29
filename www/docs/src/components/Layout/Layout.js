import React, { useEffect } from "react"

import RootLayout from "@theme/Layout"

const Layout = ({ children, ...props }) => {
  return (
    <RootLayout {...props}>
      <div className="container">{children}</div>
    </RootLayout>
  )
}

export default Layout
