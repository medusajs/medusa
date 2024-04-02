import { useAdminSalesChannel } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { SalesChannelGeneralSection } from "../../../modules/sales-channels/sales-channel-detail/components/sales-channel-general-section"
import { SalesChannelProductSection } from "./components/sales-channel-product-section"
import { salesChannelLoader } from "./loader"

export const SalesChannelDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof salesChannelLoader>
  >

  const { id } = useParams()
  const { sales_channel, isLoading } = useAdminSalesChannel(id!, {
    initialData,
  })

  if (isLoading || !sales_channel) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <SalesChannelGeneralSection salesChannel={sales_channel} />
      <SalesChannelProductSection salesChannel={sales_channel} />
      <JsonViewSection data={sales_channel} />
      <Outlet />
    </div>
  )
}
