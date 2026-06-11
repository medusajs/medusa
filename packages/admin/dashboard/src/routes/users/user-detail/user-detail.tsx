import { useLoaderData, useParams } from "react-router-dom"

import { useUser } from "../../../hooks/api/users"
import { UserGeneralSection } from "./components/user-general-section"
import { UserRoleSection } from "./components/user-role-section"
import { userLoader } from "./loader"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"

export const UserDetail = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof userLoader>>

  const { id } = useParams()
  const {
    user,
    isPending: isLoading,
    isError,
    error,
  } = useUser(id!, undefined, {
    initialData,
  })

  const { getWidgets } = useExtension()

  if (isLoading || !user) {
    return <SingleColumnPageSkeleton sections={1} showJSON showMetadata />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      data={user}
      showJSON
      showMetadata
      widgets={{
        after: getWidgets("user.details.after"),
        before: getWidgets("user.details.before"),
      }}
    >
      <UserGeneralSection user={user} />
      <PermissionGuard permission="rbac_role:read">
        <UserRoleSection user={user} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}
