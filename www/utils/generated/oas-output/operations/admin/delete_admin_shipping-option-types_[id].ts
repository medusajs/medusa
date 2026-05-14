/**
 * @oas [delete] /admin/shipping-option-types/{id}
 * operationId: DeleteShippingOptionTypesId
 * summary: Delete a Shipping Option Type
 * x-sidebar-summary: Delete Shipping Option Type
 * description: Delete a shipping option type.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option type's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
 *       sdk.admin.shippingOptionType.delete("sotype_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/shipping-option-types/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Shipping Option Types
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionTypeDeleteResponse"
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
 * x-workflow: deleteShippingOptionTypesWorkflow
 * x-events:
 *   - name: shipping-option-type.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the shipping option type
 *       }
 *       ```
 *     description: Emitted when shipping option types are deleted.
 *     deprecated: false
 *     since: 2.10.0
 * x-since: 2.10.0
 * 
*/

