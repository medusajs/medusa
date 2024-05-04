import {
  CartService,
  ProductVariantInventoryService,
} from "../../../../services"

import { EntityManager } from "typeorm"
import SalesChannelFeatureFlag from "../../../../loaders/feature-flags/sales-channels"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [get] /store/carts/{id}
 * operationId: "GetCartsCart"
 * summary: "Get a Cart"
 * description: "Retrieve a Cart's details. This includes recalculating its totals."
 * parameters:
 *   - (path) id=* {string} The ID of the Cart.
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.retrieve(cartId)
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useGetCart } from "medusa-react"
 *
 *       type Props = {
 *         cartId: string
 *       }
 *
 *       const Cart = ({ cartId }: Props) => {
 *         const { cart, isLoading } = useGetCart(cartId)
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {cart && cart.items.length === 0 && (
 *               <span>Cart is empty</span>
 *             )}
 *             {cart && cart.items.length > 0 && (
 *               <ul>
 *                 {cart.items.map((item) => (
 *                   <li key={item.id}>{item.title}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Cart
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/carts/{id}'
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
  const { id } = req.params

  const cartService: CartService = req.scope.resolve("cartService")
  const manager: EntityManager = req.scope.resolve("manager")
  const featureFlagRouter = req.scope.resolve("featureFlagRouter")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")

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
  const shouldSetAvailability = req.retrieveConfig.relations?.some((rel) =>
    rel.includes("variant")
  )

  const select = [...(req.retrieveConfig.select ?? [])]
  const salesChannelsEnabled = featureFlagRouter.isFeatureEnabled(
    SalesChannelFeatureFlag.key
  )

  if (salesChannelsEnabled) {
    select.push("sales_channel_id")
  }

  const data = await cartService.retrieveWithTotals(id, req.retrieveConfig)

  if (shouldSetAvailability) {
    await productVariantInventoryService.setVariantAvailability(
      data.items.map((i) => i.variant),
      data.sales_channel_id!
    )
  }

  res.json({ cart: cleanResponseData(data, []) })
}
