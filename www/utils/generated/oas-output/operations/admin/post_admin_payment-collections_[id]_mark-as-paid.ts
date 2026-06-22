/**
 * @oas [post] /admin/payment-collections/{id}/mark-as-paid
 * operationId: PostPaymentCollectionsIdMarkAsPaid
 * summary: Mark a Payment Collection as Paid
 * x-sidebar-summary: Mark as Paid
 * description: Mark a payment collection as paid. This creates and authorizes a payment session, then capture its payment, using the manual payment provider.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment collection's ID.
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
 *         $ref: "#/components/schemas/AdminMarkPaymentCollectionAsPaid"
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
 *       sdk.admin.paymentCollection.markAsPaid("paycol_123", {
 *         order_id: "order_123",
 *         // optional: record the payment under a specific provider
 *         provider_id: "pp_system_default"
 *       })
 *       .then(({ payment_collection }) => {
 *         console.log(payment_collection)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/payment-collections/{id}/mark-as-paid' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "order_id": "{value}"
 *       }'
 * tags:
 *   - Payment Collections
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPaymentCollectionResponse"
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
 * x-workflow: markPaymentCollectionAsPaid
 * x-events:
 *   - name: payment.captured
 *     payload: |-
 *       ```ts
 *       {
 *         id, // the ID of the payment
 *       }
 *       ```
 *     description: Emitted when a payment is captured.
 *     deprecated: false
 * 
*/

