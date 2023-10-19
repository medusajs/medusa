import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminUpdateProduct } from "medusa-react"
import { useTranslation } from "react-i18next"
import SalesChannelsModal from "../../forms/product/sales-channels-modal"
import useNotification from "../../../hooks/use-notification"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

const ChannelsModal = ({ product, open, onClose }: Props) => {
  const notification = useNotification()
  const { t } = useTranslation()

  const { mutateAsync } = useAdminUpdateProduct(product.id)

  const onUpdate = async (channels: SalesChannel[]) => {
    try {
      await mutateAsync({
        sales_channels: channels.map((c) => ({ id: c.id })),
      })
      notification(
        t("product-general-section-success", "Success"),
        t(
          "product-general-section-successfully-updated-sales-channels",
          "Successfully updated sales channels"
        ),
        "success"
      )
    } catch (e) {
      notification(
        t("product-general-section-error", "Error"),
        t(
          "product-general-section-failed-to-update-sales-channels",
          "Failed to update sales channels"
        ),
        "error"
      )
    }
  }

  return (
    <SalesChannelsModal
      onClose={onClose}
      open={open}
      source={product.sales_channels}
      onSave={onUpdate}
    />
  )
}

export default ChannelsModal
