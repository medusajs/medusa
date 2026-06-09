import { useLoaderData, useParams } from "react-router-dom"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useApiKey } from "../../../hooks/api/api-keys"
import { useExtension } from "../../../providers/extension-provider"
import { ApiKeyType } from "../common/constants"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { ApiKeySalesChannelSection } from "./components/api-key-sales-channel-section"
import { apiKeyLoader } from "./loader"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()
  const { getWidgets } = useExtension()

  const { api_key, isLoading, isError, error } = useApiKey(id!, {
    initialData: initialData,
  })

  if (isLoading || !api_key) {
    return <SingleColumnPageSkeleton showJSON sections={1} />
  }

  const isPublishable = api_key?.type === ApiKeyType.PUBLISHABLE

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      hasOutlet
      showJSON
      showRequiredPermissions
      widgets={{
        before: getWidgets("api_key.details.before"),
        after: getWidgets("api_key.details.after"),
      }}
      data={api_key}
    >
      <ApiKeyGeneralSection apiKey={api_key} />
      {isPublishable && (
        <PermissionGuard permission="sales_channel:read">
          <ApiKeySalesChannelSection apiKey={api_key} />
        </PermissionGuard>
      )}
    </SingleColumnPage>
  )
}
