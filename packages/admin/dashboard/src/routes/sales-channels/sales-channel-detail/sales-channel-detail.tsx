import { useLoaderData, useParams } from "react-router-dom"

import { PermissionGuard } from "../../../components/common/permission-guard"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
import { useExtension } from "../../../providers/extension-provider"
import { SalesChannelGeneralSection } from "./components/sales-channel-general-section"
import { SalesChannelProductSection } from "./components/sales-channel-product-section"
import { salesChannelLoader } from "./loader"

export const SalesChannelDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof salesChannelLoader>
  >

  const { id } = useParams()
  const { sales_channel, isPending: isLoading } = useSalesChannel(id!, {
    initialData,
  })

  const { getWidgets } = useExtension()

  if (isLoading || !sales_channel) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("sales_channel.details.before"),
        after: getWidgets("sales_channel.details.after"),
      }}
      showJSON
      showMetadata
      showRequiredPermissions
      data={sales_channel}
    >
      <SalesChannelGeneralSection salesChannel={sales_channel} />
      <PermissionGuard permission="product:read">
        <SalesChannelProductSection salesChannel={sales_channel} />
      </PermissionGuard>
    </SingleColumnPage>
  )
}
