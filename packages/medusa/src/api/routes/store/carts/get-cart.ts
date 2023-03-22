import { CartService } from "../../../../services"
import { EntityManager } from "typeorm"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /carts/{id}
 * operationId: "GetCartsCart"
 * summary: "Get a Cart"
 * description: "Retrieves a Cart."
 * parameters:
 *   - (path) id=* {string} The id of the Cart.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.retrieve(cart_id)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/carts/{id}'
 * tags:
 *   - Cart
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
  const { id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")
  const manager: EntityManager = req.scope.resolve("manager")

  const cart = await cartService.retrieve(id, {
    select: ["id", "customer_id"],
  })

  // If there is a logged in user add the user to the cart
  if (req.user && req.user.customer_id) {
    if (
      !cart.customer_id ||
      !cart.email ||
      cart.customer_id !== req.user.customer_id
    ) {
      await manager.transaction(async (transctionManager) => {
        await cartService.withTransaction(transctionManager).update(id, {
          customer_id: req.user.customer_id,
        })
      })
    }
  }

  const data = await cartService.retrieveWithTotals(id, req.retrieveConfig)
  res.json({ cart: cleanResponseData(data, []) })
}
