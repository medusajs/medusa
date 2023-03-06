import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { IInventoryService } from "../../../../interfaces"
import { ProductVariantInventoryService } from "../../../../services"

/**
 * @oas [delete] /inventory-items/{id}
 * operationId: "DeleteInventoryItemsInventoryItem"
 * summary: "Delete an Inventory Item"
 * description: "Delete an Inventory Item"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Inventory Item to delete.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.inventoryItems.delete(inventoryItemId)
 *         .then(({ id, object, deleted }) => {
 *           console.log(id)
 *         })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/inventory-items/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - InventoryItem
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInventoryItemsDeleteRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 */
export default async (req: Request, res: Response) => {
  const { id } = req.params

  const inventoryService: IInventoryService =
    req.scope.resolve("inventoryService")

  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    await productVariantInventoryService
      .withTransaction(transactionManager)
      .detachInventoryItem(id)

    await inventoryService
      .withTransaction(transactionManager)
      .deleteInventoryItem(id)
  })

  res.status(200).send({
    id,
    object: "inventory_item",
    deleted: true,
  })
}
