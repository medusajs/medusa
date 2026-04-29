/**
 * @oas [post] /admin/shipping-option-types/{id}
 * operationId: PostShippingOptionTypesId
 * summary: Update a Shipping Option Type
 * description: Update a shipping option type's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option type's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields.
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
 *         $ref: "#/components/schemas/AdminUpdateShippingOptionType"
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
 *       sdk.admin.shippingOptionType.update("sotype_123", {
 *         code: "express"
 *       })
 *       .then(({ shipping_option_type }) => {
 *         console.log(shipping_option_type)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-option-types/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Shipping Option Types
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionTypeResponse"
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
 * x-workflow: updateShippingOptionTypesWorkflow
 * x-events:
 *   - name: shipping-option-type.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the shipping option type
 *       }
 *       ```
 *     description: Emitted when shipping option types are updated.
 *     deprecated: false
 *     since: 2.10.0
 * x-since: 2.10.0
 * 
*/

