/**
 * @oas [post] /admin/price-lists/{id}/prices/batch
 * operationId: PostPriceListsIdPricesBatch
 * summary: Manage Prices in Price List
 * x-sidebar-summary: Manage Prices
 * description: Manage the prices of a price list to create, update, or delete them.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The price list's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The prices to create, update, or delete.
 *         properties:
 *           create:
 *             type: array
 *             description: The prices to create.
 *             items:
 *               type: object
 *               description: A price's details.
 *               required:
 *                 - currency_code
 *                 - amount
 *                 - variant_id
 *               properties:
 *                 currency_code:
 *                   type: string
 *                   title: currency_code
 *                   description: The price's currency code.
 *                 amount:
 *                   type: number
 *                   title: amount
 *                   description: The price's amount.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the variant this price is for.
 *                 min_quantity:
 *                   type: number
 *                   title: min_quantity
 *                   description: The minimum quantity that must be available of the associated variant in the cart for this price to apply.
 *                 max_quantity:
 *                   type: number
 *                   title: max_quantity
 *                   description: The maximum quantity that must be available of the associated variant in the cart for this price list to apply.
 *                 rules:
 *                   type: object
 *                   description: Key-value pair rules to apply on the price.
 *                   example:
 *                     region_id: 123
 *           update:
 *             type: array
 *             description: The prices to update.
 *             items:
 *               type: object
 *               description: The properties to update in a price.
 *               required:
 *                 - id
 *                 - variant_id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The price's ID.
 *                 currency_code:
 *                   type: string
 *                   title: currency_code
 *                   description: The price's currency code.
 *                 amount:
 *                   type: number
 *                   title: amount
 *                   description: The price's amount.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the variant this price is for.
 *                 min_quantity:
 *                   type: number
 *                   title: min_quantity
 *                   description: The minimum quantity that must be available of the associated variant in the cart for this price to apply.
 *                 max_quantity:
 *                   type: number
 *                   title: max_quantity
 *                   description: The maximum quantity that must be available of the associated variant in the cart for this price list to apply.
 *                 rules:
 *                   type: object
 *                   description: Key-value pair rules to apply on the price.
 *                   example:
 *                     region_id: 123
 *           delete:
 *             type: array
 *             description: The prices to delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: A price's ID.
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
 *       sdk.admin.priceList.batchPrices("plist_123", {
 *         create: [{
 *           variant_id: "variant_123",
 *           currency_code: "usd",
 *           amount: 10,
 *           rules: {
 *             region_id: "reg_123"
 *           }
 *         }],
 *         update: [{
 *           id: "price_123",
 *           variant_id: "variant_123",
 *           amount: 20,
 *         }],
 *         delete: ["price_123"]
 *       })
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists/{id}/prices/batch' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Price Lists
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListBatchResponse"
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
 * x-workflow: batchPriceListPricesWorkflow
 * x-events: []
 * 
*/

