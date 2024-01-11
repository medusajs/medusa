import { useAdminSalesChannel } from "medusa-react"
import { Outlet, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { SalesChannelGeneralSection } from "./components/sales-channel-general-section"
import { SalesChannelProductSection } from "./components/sales-channel-product-section"

export const SalesChannelDetail = () => {
  const { id } = useParams()
  const { sales_channel, isLoading } = useAdminSalesChannel(id!)

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
