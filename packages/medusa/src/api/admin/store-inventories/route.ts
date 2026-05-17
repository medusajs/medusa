import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AdminCreateStoreInventoryType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const storeInventoryModule = req.scope.resolve(Modules.STORE_INVENTORY)
  const [store_inventories, count] =
    await storeInventoryModule.listAndCountStoreInventories(
      req.filterableFields,
      req.queryConfig
    )

  res.json({
    store_inventories,
    count,
    offset: req.queryConfig.pagination?.skip || 0,
    limit: req.queryConfig.pagination?.take || 50,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateStoreInventoryType>,
  res: MedusaResponse
) => {
  const storeInventoryModule = req.scope.resolve(Modules.STORE_INVENTORY)
  const store_inventory = await storeInventoryModule.createStoreInventories(
    req.validatedBody
  )

  res.status(200).json({ store_inventory })
}
