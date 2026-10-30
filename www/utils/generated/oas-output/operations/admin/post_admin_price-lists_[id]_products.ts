/**
 * @oas [post] /admin/price-lists/{id}/products
 * operationId: PostPriceListsIdProducts
 * summary: Remove Products from Price List
 * description: Remove products from a price list.
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
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
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
 *         $ref: "#/components/schemas/AdminLinkPriceListProducts"
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
 *       sdk.admin.priceList.linkProducts("plist_123", {
 *         remove: ["prod_123"]
 *       })
 *       .then(({ price_list }) => {
 *         console.log(price_list)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists/{id}/products' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Price Lists
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPriceListResponse"
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
 * x-events:
 *   - name: price-list.prices_added
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the price list
 *         price_set_ids, // The IDs of the price sets whose prices were added
 *       }
 *       ```
 *     description: Emitted when prices are added to a price list.
 *     deprecated: false
 *     since: 2.21.3
 *   - name: price-list.prices_updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the price list
 *         price_set_ids, // The IDs of the price sets whose prices were updated
 *       }
 *       ```
 *     description: Emitted when prices in a price list are updated.
 *     deprecated: false
 *     since: 2.21.3
 *   - name: price-list.prices_removed
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the price list
 *         price_set_ids, // The IDs of the price sets whose prices were removed
 *       }
 *       ```
 *     description: Emitted when prices are removed from a price list.
 *     deprecated: false
 *     since: 2.21.3
 * 
*/

