import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { AdminUpdateStoreInventoryType } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const storeInventoryModule = req.scope.resolve(Modules.STORE_INVENTORY)
  const store_inventory = await storeInventoryModule.retrieveStoreInventory(
    req.params.id,
    req.queryConfig
  )

  if (!store_inventory) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `StoreInventory with id: ${req.params.id} was not found`
    )
  }

  res.json({ store_inventory })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateStoreInventoryType>,
  res: MedusaResponse
) => {
  const storeInventoryModule = req.scope.resolve(Modules.STORE_INVENTORY)
  const store_inventory = await storeInventoryModule.updateStoreInventories(
    req.params.id,
    req.validatedBody
  )

  res.json({ store_inventory })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const storeInventoryModule = req.scope.resolve(Modules.STORE_INVENTORY)
  await storeInventoryModule.deleteStoreInventories(req.params.id)

  res.status(200).json({
    id: req.params.id,
    object: "store_inventory",
    deleted: true,
  })
}
