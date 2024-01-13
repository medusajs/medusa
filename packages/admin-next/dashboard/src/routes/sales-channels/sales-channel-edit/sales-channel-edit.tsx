import { Drawer, Heading } from "@medusajs/ui"
import { useAdminSalesChannel } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditSalesChannelForm } from "./components/edit-sales-channel-form"

export const SalesChannelEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [open, onOpenChange, subscribe] = useRouteModalState()
  const { sales_channel, isLoading, isError, error } = useAdminSalesChannel(id!)

  const onSuccess = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading className="capitalize">
            {t("salesChannels.editSalesChannel")}
          </Heading>
        </Drawer.Header>
        {!isLoading && sales_channel && (
          <EditSalesChannelForm
            salesChannel={sales_channel}
            subscribe={subscribe}
            onSuccess={onSuccess}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
