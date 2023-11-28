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
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={[t("customers"), t("groups")]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
