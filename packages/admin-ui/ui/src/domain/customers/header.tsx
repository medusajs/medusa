import { useNavigate } from "react-router-dom"
import TableViewHeader from "../../components/organisms/custom-table-header"
import { useTranslation } from "react-i18next"

type P = {
  activeView: "customers" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const { t } = useTranslation()

  const views = [
    { key: "customers", label: t("customers-header", "Customers") },
    { key: "groups", label: t("customer-groups-header", "Groups") },
  ]

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
      views={views}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
