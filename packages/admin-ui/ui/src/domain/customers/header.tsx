import { useNavigate } from "react-router-dom"
import TableViewHeader from "../../components/organisms/custom-table-header"
import { useAdminGetSession } from "medusa-react"

type P = {
  activeView: "customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  const { user } = useAdminGetSession()

  const VIEWS = ["customers"]

  if (!user?.store_id) {
    VIEWS.push("groups")
  }

  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={VIEWS}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
