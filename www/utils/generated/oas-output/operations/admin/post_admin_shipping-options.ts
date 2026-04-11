/**
 * @oas [post] /admin/shipping-options
 * operationId: PostShippingOptions
 * summary: Create Shipping Option
 * description: Create a shipping option.
 * x-authenticated: true
 * parameters:
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
 *         oneOf:
 *           - $ref: "#/components/schemas/AdminCreateFlatRateShippingOption"
 *           - $ref: "#/components/schemas/AdminCreateCalculatedShippingOption"
 *         description: The shipping option's details.
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
 *       sdk.admin.shippingOption.create({
 *         name: "Standard Shipping",
 *         profile_id: "shp_123",
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Julie",
 *         "service_zone_id": "{value}",
 *         "shipping_profile_id": "{value}",
 *         "price_type": "{value}",
 *         "provider_id": "{value}",
 *         "type": {
 *           "label": "{value}",
 *           "description": "{value}",
 *           "code": "{value}"
 *         },
 *         "prices": []
 *       }'
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
 * x-workflow: createShippingOptionsWorkflow
 * x-events:
 *   - name: shipping-option.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the shipping option
 *       }
 *       ```
 *     description: Emitted when shipping options are created.
 *     deprecated: false
 *     since: 2.12.4
 * 
*/

