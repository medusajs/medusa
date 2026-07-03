import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { useRbacRole } from "../../../hooks/api/rbac-roles"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { RoleGeneralSection } from "./components/role-general-section"
import { RoleUsersSection } from "./components/role-users-section"
import { roleLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { ROLE_DETAIL_FIELDS } from "./constants"

export const RoleDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof roleLoader>>
  const { id } = useParams()
  const isRbacEnabled = useRequireRbacFeature()

  const {
    role,
    isPending: isLoading,
    isError,
    error,
  } = useRbacRole(
    id!,
    { fields: ROLE_DETAIL_FIELDS },
    {
      initialData,
      enabled: !!id && isRbacEnabled,
    }
  )

  if (!isRbacEnabled) {
    return null
  }

  if (isError) {
    throw error
  }

  if (isLoading || !role) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="role.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={role}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="RoleGeneralSection">
              <RoleGeneralSection role={role} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="RoleUsersSection">
              <PermissionGuard permission="user:read">
                <RoleUsersSection role={role} />
              </PermissionGuard>
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(role, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
