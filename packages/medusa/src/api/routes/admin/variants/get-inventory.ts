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

/**
 * @oas [get] /variants/{id}/inventory
 * operationId: "GetVariantsVariantInventory"
 * summary: "Get inventory of Variant."
 * description: "Returns the available inventory of a Variant."
 * x-authenticated: true
 * parameters:
 *   - (path) id {string} The Product Variant id to get inventory for.
 * x-codegen:
 *   method: getInventory
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.variants.list()
 *         .then(({ variants, limit, offset, count }) => {
 *           console.log(variants.length)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/variants' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Product Variant
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             variant:
 *               type: object
 *               $ref: "#/components/schemas/AdminGetVariantsVariantInventoryRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const channelService: SalesChannelService = req.scope.resolve(
    "salesChannelService"
  )
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const variantService: ProductVariantService = req.scope.resolve(
    "productVariantService"
  )

  const variant = await variantService.retrieve(id, { select: ["id"] })

  const responseVariant: AdminGetVariantsVariantInventoryRes = {
    id: variant.id,
    inventory: [],
    sales_channel_availability: [],
  }

  const [channels] = await channelService.listAndCount(
    {},
    {
      relations: ["locations"],
    }
  )

  const inventory =
    await productVariantInventoryService.listInventoryItemsByVariant(variant.id)
  responseVariant.inventory = await joinLevels(inventory, [], inventoryService)

  // TODO: adjust for required quantity
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
          channel.locations.map((loc) => loc.id)
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

type ResponseInventoryItem = Partial<InventoryItemDTO> & {
  location_levels?: InventoryLevelDTO[]
}

/**
 * @schema AdminGetVariantsVariantInventoryRes
 * type: object
 * properties:
 *   id:
 *     description: the id of the variant
 *     type: string
 *   inventory:
 *     description: the stock location address ID
 *     type: string
 *   sales_channel_availability:
 *     type: object
 *     description: An optional key-value map with additional details
 *     properties:
 *       channel_name:
 *         description: Sales channel name
 *         type: string
 *       channel_id:
 *         description: Sales channel id
 *         type: string
 *       available_quantity:
 *         description: Available quantity in sales channel
 *         type: number
 */
export type AdminGetVariantsVariantInventoryRes = {
  id: string
  inventory: ResponseInventoryItem[]
  sales_channel_availability: {
    channel_name: string
    channel_id: string
    available_quantity: number
  }[]
}
