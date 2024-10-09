import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
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

  const { getWidgets } = useDashboardExtension()

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
      data={sales_channel}
    >
      <SalesChannelGeneralSection salesChannel={sales_channel} />
      <SalesChannelProductSection salesChannel={sales_channel} />
    </SingleColumnPage>
  )
}
