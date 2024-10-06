import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
import { SalesChannelGeneralSection } from "./components/sales-channel-general-section"
import { SalesChannelProductSection } from "./components/sales-channel-product-section"
import { salesChannelLoader } from "./loader"

import after from "virtual:medusa/widgets/sales_channel/details/after"
import before from "virtual:medusa/widgets/sales_channel/details/before"
import { SingleColumnPage } from "../../../components/layout/pages"

export const SalesChannelDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof salesChannelLoader>
  >

  const { id } = useParams()
  const { sales_channel, isPending: isLoading } = useSalesChannel(id!, {
    initialData,
  })

  if (isLoading || !sales_channel) {
    return <div>Loading...</div>
  }

  return (
    <SingleColumnPage
      widgets={{
        before,
        after,
      }}
      data={sales_channel}
      hasOutlet
      showMetadata
      showJSON
    >
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={sales_channel} />
          </div>
        )
      })}
      <SalesChannelGeneralSection salesChannel={sales_channel} />
      <SalesChannelProductSection salesChannel={sales_channel} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={sales_channel} />
          </div>
        )
      })}
    </SingleColumnPage>
  )
}
