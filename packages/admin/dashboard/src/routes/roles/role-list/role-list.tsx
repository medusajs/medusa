import { SingleColumnPage } from "../../../components/layout/pages"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { useExtension } from "../../../providers/extension-provider"
import { RoleListTable } from "./components/role-list-table"

export const RoleList = () => {
  const { getWidgets } = useExtension()
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("role.list.before"),
        after: getWidgets("role.list.after"),
      }}
    >
      <RoleListTable />
    </SingleColumnPage>
  )
}
