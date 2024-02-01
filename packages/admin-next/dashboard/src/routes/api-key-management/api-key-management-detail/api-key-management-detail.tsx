import { useAdminPublishableApiKey } from "medusa-react"
import { Outlet, json, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { ApiKeySalesChannelSection } from "./components/api-key-sales-channel-section"
import { apiKeyLoader } from "./loader"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()
  const { publishable_api_key, isLoading, isError, error } =
    useAdminPublishableApiKey(id!, {
      initialData,
    })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !publishable_api_key) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyGeneralSection apiKey={publishable_api_key} />
      <ApiKeySalesChannelSection apiKey={publishable_api_key} />
      <JsonViewSection data={publishable_api_key} />
      <Outlet />
    </div>
  )
}
