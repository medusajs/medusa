import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PolicyListTable } from "./components/policy-list-table"

export const PolicyList = () => {
  const { getWidgets } = useExtension()
  const isRbacEnabled = useFeatureFlag("rbac")
  const navigate = useNavigate()

  useEffect(() => {
    if (!isRbacEnabled) {
      navigate(-1)
    }
  }, [isRbacEnabled, navigate])

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
