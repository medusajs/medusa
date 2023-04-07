import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminUpdateProduct } from "medusa-react"
import SalesChannelsModal from "../../forms/product/sales-channels-modal"
import useNotification from "../../../hooks/use-notification"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

const ChannelsModal = ({ product, open, onClose }: Props) => {
  const notification = useNotification()

  const { mutateAsync } = useAdminUpdateProduct(product.id)

  const onUpdate = async (channels: SalesChannel[]) => {
    try {
      await mutateAsync({
        sales_channels: channels.map((c) => ({ id: c.id })),
      })
      notification("Success", "Successfully updated sales channels", "success")
    } catch (e) {
      notification("Error", "Failed to update sales channels", "error")
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
