import { defineLink } from "@medusajs/framework/utils"
import ChannelPriceModule from "@medusajs/channel-price"
import MaterialModule from "@medusajs/material"

export default defineLink(
  { linkable: ChannelPriceModule.linkable.channelPrice },
  { linkable: MaterialModule.linkable.salesMaterial }
)
