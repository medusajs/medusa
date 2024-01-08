import { useAdminSalesChannel } from "medusa-react"
import { useParams } from "react-router-dom"

import { JsonView } from "../../../../components/common/json-view"
import { SalesChannelDetailsSection } from "../../components/sales-channel-details-section"
import { SalesChannelProductsSection } from "../../components/sales-channel-products-section"

export const SalesChannelDetails = () => {
  const { id } = useParams()
  const { sales_channel, isLoading } = useAdminSalesChannel(id!)

  if (isLoading || !sales_channel) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <SalesChannelDetailsSection salesChannel={sales_channel} />
      <SalesChannelProductsSection salesChannel={sales_channel} />
      <JsonView data={sales_channel} />
    </div>
  )
}
