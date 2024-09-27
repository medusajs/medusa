import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { UserListTable } from "./components/user-list-table"

export const UserList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("user.list.after"),
        before: getWidgets("user.list.before"),
      }}
    >
      <UserListTable />
    </SingleColumnPage>
  )
}
