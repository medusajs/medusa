import {
  InventoryItemDTO,
  InventoryLevelDTO,
} from "../../../../types/inventory"
import ProductVariantInventoryService from "../../../../services/product-variant-inventory"
import {
  SalesChannelLocationService,
  SalesChannelService,
} from "../../../../services"
import { SalesChannel } from "../../../../models"
import { IInventoryService } from "../../../../interfaces"
import ProductVariantService from "../../../../services/product-variant"
import { joinLevels } from "../inventory-items/utils/join-levels"

export default async (req, res) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")
  const channelLocationService: SalesChannelLocationService = req.scope.resolve(
    "salesChannelLocationService"
  )
  const channelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const variantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const variant = await variantService.retrieve(id, { select: ["id"] })
  const [rawChannels] = await channelService.listAndCount({})
  const channels: SalesChannelDTO[] = await Promise.all(
    rawChannels.map(async (channel) => {
      const locations = await channelLocationService.listLocations(channel.id)
      return {
        ...channel,
        locations,
      }
    })
  )

  const responseVariant: ResponseVariant = {
    id: variant.id,
    inventory: [],
    sales_channel_availability: [],
  }
  const inventory = await variantInventoryService.listInventoryItemsByVariant(
    variant.id
  )
  responseVariant.inventory = await joinLevels(inventory, [], inventoryService)

  if (inventory.length) {
    responseVariant.sales_channel_availability = await Promise.all(
      channels.map(async (channel) => {
        if (!channel.locations.length) {
          return {
            channel_name: channel.name as string,
            channel_id: channel.id as string,
            available_quantity: 0,
          }
        }
        const quantity = await inventoryService.retrieveAvailableQuantity(
          inventory[0].id,
          channel.locations
        )
        return {
          channel_name: channel.name as string,
          channel_id: channel.id as string,
          available_quantity: quantity,
        }
      })
    )
  }

  res.json({
    variant: responseVariant,
  })
}

type SalesChannelDTO = Partial<SalesChannel> & { locations: string[] }

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  location_levels?: InventoryLevelDTO[]
}

export type ResponseVariant = {
  id: string
  inventory: ResponseInventoryItem[]
  sales_channel_availability: {
    channel_name: string
    channel_id: string
    available_quantity: number
  }[]
}
