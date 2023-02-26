import React from "react"

import TableViewHeader from "../../components/organisms/custom-table-header"
import { useNavigate } from "react-router-dom"

type P = {
  activeView: "customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={["customers", "groups"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
