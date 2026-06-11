import { SingleColumnPage } from "../../../components/layout/pages"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { useExtension } from "../../../providers/extension-provider"
import { PolicyListTable } from "./components/policy-list-table"

export const PolicyList = () => {
  const { getWidgets } = useExtension()
  const isRbacEnabled = useRequireRbacFeature()

  if (!isRbacEnabled) {
    return null
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("policy.list.before"),
        after: getWidgets("policy.list.after"),
      }}
    >
      <PolicyListTable />
    </SingleColumnPage>
  )
}
