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
 *                 - variant_id
 *                 - amount
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
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists/{id}/prices/batch' \
 *       -H 'Authorization: Bearer {access_token}'
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
 * 
*/

