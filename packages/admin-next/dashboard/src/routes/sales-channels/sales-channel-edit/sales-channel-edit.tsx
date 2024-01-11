import { Drawer, Heading } from "@medusajs/ui"
import { useAdminSalesChannel } from "medusa-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import { EditSalesChannelForm } from "./components/edit-sales-channel-form"

export const SalesChannelEdit = () => {
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  const { sales_channel, isLoading, isError, error } = useAdminSalesChannel(id!)

  const { t } = useTranslation()

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        navigate("..", {
          replace: true,
        })
      }, 200)
    }

    setOpen(open)
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
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
