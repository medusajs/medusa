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
 *             description: The The associations to create between product variants and inventory items.
 *             items:
 *               type: object
 *               description: The associations to create between a product variant and an inventory item.
 *               required:
 *                 - variant_id
 *                 - inventory_item_id
 *                 - required_quantity
 *               properties:
 *                 required_quantity:
 *                   type: number
 *                   title: required_quantity
 *                   description: The variant's quantity.
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
 *                 - inventory_item_id
 *                 - required_quantity
 *               properties:
 *                 required_quantity:
 *                   type: number
 *                   title: required_quantity
 *                   description: The variant's quantity.
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
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/variants/inventory-items/batch' \
 *       -H 'Authorization: Bearer {access_token}'
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
 * 
*/

