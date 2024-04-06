import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useApiKey } from "../../../hooks/api/api-keys"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { apiKeyLoader } from "./loader"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()
  const { api_key, isLoading, isError, error } = useApiKey(id!, undefined, {
    initialData: initialData,
  })

  if (isLoading || !api_key) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyGeneralSection apiKey={api_key} />
      {/* <ApiKeySalesChannelSection apiKey={apiKey} /> */}
      <JsonViewSection data={api_key} />
      <Outlet />
    </div>
  )
}
