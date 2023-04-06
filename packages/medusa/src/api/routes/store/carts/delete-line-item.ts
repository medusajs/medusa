import { EntityManager } from "typeorm"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService } from "../../../../services"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [delete] /store/carts/{id}/line-items/{line_id}
 * operationId: DeleteCartsCartLineItemsItem
 * summary: Delete a Line Item
 * description: "Removes a Line Item from a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 *   - (path) line_id=* {string} The id of the Line Item.
 * x-codegen:
 *   method: deleteLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.lineItems.delete(cart_id, line_id)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/store/carts/{id}/line-items/{line_id}'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  const { id, line_id } = req.params

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve("cartService")

  await manager.transaction(async (m) => {
    const cartServiceTx = cartService.withTransaction(m)

    // Remove the line item
    await cartServiceTx.removeLineItem(id, line_id)

    // If the cart has payment sessions update these
    const updated = await cartServiceTx.retrieve(id, {
      relations: ["payment_sessions"],
    })

    if (updated.payment_sessions?.length) {
      await cartServiceTx.setPaymentSessions(id)
    }
  })

  const data = await cartService.retrieveWithTotals(id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  res.status(200).json({ cart: cleanResponseData(data, []) })
}
