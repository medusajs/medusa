import { IShopModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const updateShopStep = createStep(
  "update-shop",
  async (input: { id: string; [key: string]: unknown }, { container }) => {
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    const shop = await shopModule.updateShops(input.id, input)
    return new StepResponse(shop, shop)
  },
  async (originalShop, { container }) => {
    if (!originalShop) return
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    await shopModule.updateShops(originalShop.id, originalShop)
  }
)
