import { useEffect } from "react"
import { useLoaderData, useNavigate, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useRbacPolicy } from "../../../hooks/api/rbac-policies"
import { useExtension } from "../../../providers/extension-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { PolicyGeneralSection } from "./components/policy-general-section"
import { PolicyRolesSection } from "./components/policy-roles-section"
import { POLICY_DETAIL_FIELDS } from "./constants"
import { policyLoader } from "./loader"
import { usePermissions } from "../../../providers/permissions-provider"

export const PolicyDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof policyLoader>
  >
  const { id } = useParams()
  const { getWidgets } = useExtension()
  const isRbacEnabled = useFeatureFlag("rbac")
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  useEffect(() => {
    if (!isRbacEnabled) {
      navigate(-1)
    }
  }, [isRbacEnabled, navigate])

  const {
    policy,
    isPending: isLoading,
    isError,
    error,
  } = useRbacPolicy(
    id!,
    { fields: POLICY_DETAIL_FIELDS },
    {
      initialData,
      enabled: !!id && isRbacEnabled,
    }
  )

  if (isLoading || !policy) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={policy}
      showJSON
      showMetadata
      widgets={{
        before: getWidgets("policy.details.before"),
        after: getWidgets("policy.details.after"),
      }}
    >
      <PolicyGeneralSection policy={policy} />
      {hasPermission("rbac_role:read") && (
        <PolicyRolesSection policy={policy} />
      )}
    </SingleColumnPage>
  )
}
