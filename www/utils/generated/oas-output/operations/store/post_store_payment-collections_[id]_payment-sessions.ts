/**
 * @oas [post] /store/payment-collections/{id}/payment-sessions
 * operationId: PostPaymentCollectionsIdPaymentSessions
 * summary: Initialize Payment Session of a Payment Collection
 * x-sidebar-summary: Initialize Payment Session
 * description: Initialize and add a payment session to a payment collection. This is used during checkout, where you create a payment collection for the cart, then initialize a payment session for the payment provider that the customer chooses.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/checkout/payment
 *   description: "Storefront guide: How to implement payment during checkout."
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment collection's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
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
 *         url: #select-fields-and-relations
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The payment session's details.
 *         required:
 *           - provider_id
 *         properties:
 *           provider_id:
 *             type: string
 *             title: provider_id
 *             description: The ID of the payment provider the customer chose.
 *             example: pp_stripe_stripe
 *           context:
 *             type: object
 *             description: The payment's context, such as the customer or address details. If the customer is logged-in, the customer `id` is set in the context under a `customer.id` property.
 *           data:
 *             type: object
 *             description: Any data necessary for the payment provider to process the payment.
 *             externalDocs:
 *               url: https://docs.medusajs.com/v2/resources/commerce-modules/payment/payment-session#data-property
 *               description: Learn more about the payment session's data property
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/payment-collections/{id}/payment-sessions' \
 *       -H 'Content-Type: application/json' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 *       --data-raw '{
 *         "provider_id": "{value}"
 *       }'
 * tags:
 *   - Payment Collections
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StorePaymentCollectionResponse"
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
 * x-workflow: createPaymentSessionsWorkflow
 * 
*/

