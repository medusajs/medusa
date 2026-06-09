import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { UserListTable } from "./components/user-list-table"

export const UserList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("user.list.after"),
        before: getWidgets("user.list.before"),
      }}
      showRequiredPermissions
    >
      <UserListTable />
    </SingleColumnPage>
  )
}
