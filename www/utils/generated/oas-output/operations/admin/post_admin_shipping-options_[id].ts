/**
 * @oas [post] /admin/shipping-options/{id}
 * operationId: PostShippingOptionsId
 * summary: Update a Shipping Option
 * description: |
 *   Update a shipping option's details.
 * 
 *   When you provide the `prices` array, it replaces the shipping option's existing flat-rate prices:
 * 
 *   - A price with a matching `id` is updated.
 *   - A price without an `id` is created
 *   - Any existing price whose `id` isn't included in the array is deleted.
 * 
 *   The `rules` you provide for a price similarly replace that price's existing rules, so omit a rule to remove it.
 * 
 *   Omitting the `prices` property entirely leaves the existing prices unchanged, whereas setting `price_type` to `calculated` removes all flat-rate prices.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option's ID.
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
 *         $ref: "#/components/schemas/AdminUpdateShippingOption"
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
 *       sdk.admin.shippingOption.update("so_123", {
 *         name: "Standard Shipping",
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionResponse"
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
 * x-workflow: updateShippingOptionsWorkflow
 * x-events:
 *   - name: shipping-option.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the shipping option
 *       }
 *       ```
 *     description: Emitted when shipping options are updated.
 *     deprecated: false
 *     since: 2.12.4
 * 
*/

