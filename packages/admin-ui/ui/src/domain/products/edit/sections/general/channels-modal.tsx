import { Product, SalesChannel } from "@medusajs/medusa"
import { useAdminUpdateProduct } from "medusa-react"
import React from "react"
import SalesChannelsModal from "../../../components/sales-channels-modal"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

const ChannelsModal = ({ product, open, onClose }: Props) => {
  const { mutate } = useAdminUpdateProduct(product.id)

  const onUpdate = (channels: SalesChannel[]) => {
    // @ts-ignore
    mutate({
      sales_channels: channels.map((c) => ({ id: c.id })),
    })
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
