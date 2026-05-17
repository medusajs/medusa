import { IShopModuleService } from "@medusajs/framework/types"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

export const deleteShopStep = createStep(
  "delete-shop",
  async (input: { id: string }, { container }) => {
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    const shop = await shopModule.retrieveShop(input.id)
    await shopModule.deleteShops(input.id)
    return new StepResponse(void 0, shop)
  },
  async (shop, { container }) => {
    if (!shop) return
    const shopModule = container.resolve<IShopModuleService>(Modules.SHOP)
    await shopModule.createShops(shop)
  }
)
