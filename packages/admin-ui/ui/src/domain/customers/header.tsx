import React from "react"

import TableViewHeader from "../../components/organisms/custom-table-header"
import { useNavigate } from "react-router-dom"
import { useBasePath } from "../../utils/routePathing"

type P = {
  activeView: "customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  const basePath = useBasePath()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`${basePath}/customers`)
        } else {
          navigate(`${basePath}/customers/groups`)
        }
      }}
      views={["customers", "groups"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
