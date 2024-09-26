import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { CustomerGroupListTable } from "./components/customer-group-list-table"

export const CustomerGroupsList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("customer_group.list.after"),
        before: getWidgets("customer_group.list.before"),
      }}
    >
      <CustomerGroupListTable />
    </SingleColumnPage>
  )
}
