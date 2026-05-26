import { useLoaderData, useParams } from "react-router-dom"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { useRbacRole } from "../../../hooks/api/rbac-roles"
import { useRequireRbacFeature } from "../../../hooks/use-require-rbac-feature"
import { RoleGeneralSection } from "./components/role-general-section"
import { RoleUsersSection } from "./components/role-users-section"
import { roleLoader } from "./loader"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import { ROLE_DETAIL_FIELDS } from "./constants"

export const RoleDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof roleLoader>>
  const { id } = useParams()
  const { getWidgets } = useExtension()
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
    <SingleColumnPage
      data={role}
      showJSON
      showMetadata
      widgets={{
        before: getWidgets("role.details.before"),
        after: getWidgets("role.details.after"),
      }}
    >
      <RoleGeneralSection role={role} />
      <PermissionGuard permission="user:read">
        <RoleUsersSection role={role} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}
