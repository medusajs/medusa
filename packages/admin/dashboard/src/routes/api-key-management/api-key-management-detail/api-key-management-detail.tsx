import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
import { useApiKey } from "../../../hooks/api/api-keys"
import { ApiKeyType } from "../common/constants"
import { ApiKeyGeneralSection } from "./components/api-key-general-section"
import { ApiKeySalesChannelSection } from "./components/api-key-sales-channel-section"
import { apiKeyLoader } from "./loader"

export const ApiKeyManagementDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof apiKeyLoader>
  >

  const { id } = useParams()

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
    <LayoutComposer
      widgetsZonePrefix="api_key.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={api_key}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="ApiKeyGeneralSection">
              <ApiKeyGeneralSection apiKey={api_key} />
            </LayoutComposer.Entry>
            {isPublishable && (
              <LayoutComposer.Entry id="ApiKeySalesChannelSection">
                <ApiKeySalesChannelSection apiKey={api_key} />
              </LayoutComposer.Entry>
            )}
            {detailPageDefaultEntries(api_key, { metadata: false, permissions: false })}
          </>
        ),
      }}
    />
  )
}
