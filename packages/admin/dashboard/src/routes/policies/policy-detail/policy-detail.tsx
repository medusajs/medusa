import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useRbacPolicy } from "../../../hooks/api/rbac-policies"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { useExtension } from "../../../providers/extension-provider"
import { usePermissions } from "../../../providers/permissions-provider"
import { PolicyGeneralSection } from "./components/policy-general-section"
import { PolicyRolesSection } from "./components/policy-roles-section"
import { POLICY_DETAIL_FIELDS } from "./constants"
import { policyLoader } from "./loader"

export const PolicyDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof policyLoader>
  >
  const { id } = useParams()
  const { getWidgets } = useExtension()
  const isRbacEnabled = useRequireRbacFeature()
  const { hasPermission } = usePermissions()

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

  if (isError) {
    throw error
  }

  if (isLoading || !policy) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
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
