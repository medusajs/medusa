import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useApiKey } from "../../../hooks/api/api-keys"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { ApiKeySalesChannelSection } from "./components/api-key-sales-channel-section"
import { apiKeyLoader } from "./loader"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()
  const { apiKey, isLoading, isError, error } = useApiKey(id!, undefined, {
    initialData: initialData,
  })

  if (isLoading || !apiKey) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyGeneralSection apiKey={apiKey} />
      <ApiKeySalesChannelSection apiKey={apiKey} />
      <JsonViewSection data={apiKey} />
      <Outlet />
    </div>
  )
}
