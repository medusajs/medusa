import { adminPublishableApiKeysKeys, useAdminCustomQuery } from "medusa-react"
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
  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/api-keys/${id}`,
    [adminPublishableApiKeysKeys.detail(id!)],
    undefined,
    {
      initialData: initialData,
    }
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data?.api_key) {
    if (error) {
      throw error
    }

    throw json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <ApiKeyGeneralSection apiKey={data?.api_key} />
      <ApiKeySalesChannelSection apiKey={data?.api_key} />
      <JsonViewSection data={data?.api_key} />
      <Outlet />
    </div>
  )
}
