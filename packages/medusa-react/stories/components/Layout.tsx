import React from "react"
import ReactJson from "react-json-view"

const Layout = ({ children, showHookData, data }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
      <div>{children}</div>
      <div style={{ overflowX: "auto" }}>
        <h3>Raw</h3>
        {showHookData && <ReactJson src={data} collapsed={true} />}
      </div>
    </div>
  )
}

export default Layout
