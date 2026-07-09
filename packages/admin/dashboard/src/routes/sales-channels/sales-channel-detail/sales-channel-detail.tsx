import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"
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
            <LayoutComposer.Entry id="SalesChannelGeneralSection">
              <SalesChannelGeneralSection salesChannel={sales_channel} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="SalesChannelProductSection">
              <SalesChannelProductSection salesChannel={sales_channel} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(sales_channel, { permissions: false })}
          </>
        ),
      }}
    />
  )
}
