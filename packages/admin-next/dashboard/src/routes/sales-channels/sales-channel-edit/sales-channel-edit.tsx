import { Heading } from "@medusajs/ui"
import { useAdminSalesChannel } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { EditSalesChannelForm } from "./components/edit-sales-channel-form"

export const SalesChannelEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { sales_channel, isLoading, isError, error } = useAdminSalesChannel(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading className="capitalize">
          {t("salesChannels.editSalesChannel")}
        </Heading>
      </RouteDrawer.Header>
      {!isLoading && sales_channel && (
        <EditSalesChannelForm salesChannel={sales_channel} />
      )}
    </RouteDrawer>
  )
}
