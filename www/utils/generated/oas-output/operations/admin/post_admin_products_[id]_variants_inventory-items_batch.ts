/**
 * @oas [post] /admin/products/{id}/variants/inventory-items/batch
 * operationId: PostProductsIdVariantsInventoryItemsBatch
 * summary: Manage Variants Inventory in a Product
 * x-sidebar-summary: Manage Variants Inventory
 * description: Manage a product's variant's inventoris to associate them with inventory items, update their inventory items, or delete their association with inventory items.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminBatchVariantInventoryItems"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.product.batchVariantInventoryItems(
 *         "prod_123",
 *         {
 *           create: [
 *             {
 *               inventory_item_id: "iitem_123",
 *               variant_id: "variant_123",
 *               required_quantity: 10
 *             }
 *           ],
 *           update: [
 *             {
 *               inventory_item_id: "iitem_1234",
 *               variant_id: "variant_1234",
 *               required_quantity: 20
 *             }
 *           ],
 *           delete: [
 *             {
 *               inventory_item_id: "iitem_321",
 *               variant_id: "variant_321"
 *             }
 *           ]
 *         }
 *       )
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/variants/inventory-items/batch' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductVariantInventoryBatchResponse"
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
 * x-workflow: batchLinksWorkflow
 * x-events: []
 * 
*/

