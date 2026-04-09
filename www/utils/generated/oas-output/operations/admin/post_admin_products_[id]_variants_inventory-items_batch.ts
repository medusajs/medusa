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
 *         type: object
 *         description: The product variant inventories to manage.
 *         properties:
 *           create:
 *             type: array
 *             description: The associations to create between product variants and inventory items.
 *             items:
 *               type: object
 *               description: The associations to create between a product variant and an inventory item.
 *               required:
 *                 - variant_id
 *                 - required_quantity
 *                 - inventory_item_id
 *               properties:
 *                 required_quantity:
 *                   type: number
 *                   title: required_quantity
 *                   description: The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
 *                     value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item to associate the variant with.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the variant.
 *           update:
 *             type: array
 *             description: The product variants to update their association with inventory items.
 *             items:
 *               type: object
 *               description: Update a product variant's association with an inventory item.
 *               required:
 *                 - variant_id
 *                 - required_quantity
 *                 - inventory_item_id
 *               properties:
 *                 required_quantity:
 *                   type: number
 *                   title: required_quantity
 *                   description: The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
 *                     value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item the variant is associated with.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the variant.
 *           delete:
 *             type: array
 *             description: The product variants to delete their association with inventory items.
 *             items:
 *               type: object
 *               description: Delete a product variant's association with an inventory item.
 *               required:
 *                 - variant_id
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item associated with the variant.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the variant.
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

