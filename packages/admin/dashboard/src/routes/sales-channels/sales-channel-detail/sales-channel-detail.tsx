import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { MetadataSection } from "../../../components/common/metadata-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
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

  if (isLoading || !sales_channel) {
    return <SingleColumnPageSkeleton sections={2} showJSON showMetadata />
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="sales_channel.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={sales_channel}
      sections={{
        main: (
          <>
            <SalesChannelGeneralSection salesChannel={sales_channel} />
            <SalesChannelProductSection salesChannel={sales_channel} />
            <MetadataSection data={sales_channel} />
            <JsonViewSection data={sales_channel} />
          </>
        ),
      }}
    />
  )
}
