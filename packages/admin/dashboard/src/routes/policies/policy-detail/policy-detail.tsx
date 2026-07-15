import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useRbacPolicy } from "../../../hooks/api/rbac-policies"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
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
    <LayoutComposer
      widgetsZonePrefix="policy.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={policy}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="PolicyGeneralSection">
              <PolicyGeneralSection policy={policy} />
            </LayoutComposer.Entry>
            {hasPermission("rbac_role:read") && (
              <LayoutComposer.Entry id="PolicyRolesSection">
                <PolicyRolesSection policy={policy} />
              </LayoutComposer.Entry>
            )}
            {detailPageDefaultEntries(policy, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
