import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { CustomerGroupListTable } from "./components/customer-group-list-table"

export const CustomerGroupsList = () => {
  const { getWidgets } = useDashboardExtension()

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
