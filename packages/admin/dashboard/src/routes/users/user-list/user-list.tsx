import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"
import { UserListTable } from "./components/user-list-table"

export const UserList = () => {
  const { getWidgets } = useMedusaApp()

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
