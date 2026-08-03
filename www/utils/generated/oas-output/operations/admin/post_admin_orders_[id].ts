/**
 * @oas [post] /admin/orders/{id}
 * operationId: PostOrdersId
 * summary: Update Order
 * description: |-
 *   Update an order's details.
 * 
 *   Updating the order's shipping or billing address doesn't recalculate the order's taxes or totals; the existing tax lines are preserved as-is. You also can't change the address's `country_code`.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: version
 *     in: query
 *     description: Retrieve a specific version of the order. If no version is provided, the latest version will be retrieved.
 *     required: false
 *     schema:
 *       type: number
 *       title: version
 *       description: The order's version.
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
 *         $ref: "#/components/schemas/AdminUpdateOrder"
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
 *       sdk.admin.order.update(
 *         "order_123",
 *         {
 *           email: "new_email@example.com",
 *           shipping_address: {
 *             first_name: "John",
 *             last_name: "Doe",
 *             address_1: "123 Main St",
 *           }
 *         }
 *       )
 *       .then(({ order }) => {
 *         console.log(order)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderResponse"
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
 * x-workflow: updateOrderWorkflow
 * x-events:
 *   - name: order.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the order
 *       }
 *       ```
 *     description: |-
 *       Emitted when the details of an order or draft order is updated. This
 *       doesn't include updates made by an edit.
 *     deprecated: false
 * 
*/

