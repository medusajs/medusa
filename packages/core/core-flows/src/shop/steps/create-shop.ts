import { IShopModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const createShopStep = createStep(
  "create-shop",
  async (
    input: {
      shop_code: string
      shop_name: string
      platform_type: string
      [key: string]: unknown
    },
    { container }
  ) => {
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    const shop = await shopModule.createShops(input)
    return new StepResponse(shop, shop.id)
  },
  async (shopId, { container }) => {
    if (!shopId) return
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    await shopModule.deleteShops(shopId)
  }
)
