/**
 * @oas [post] /store/payment-collections
 * operationId: PostPaymentCollections
 * summary: Create Payment Collection
 * description: Create a payment collection for a cart. This is used during checkout, where the payment collection holds the cart's payment sessions.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/checkout/payment
 *   description: "Storefront guide: How to implement payment during checkout."
 * x-authenticated: false
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StoreCreatePaymentCollection"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/payment-collections' \
 *       -H 'Content-Type: application/json' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 *       --data-raw '{
 *         "cart_id": "{value}",
 *         "region_id": "{value}",
 *         "currency_code": "{value}",
 *         "amount": 8468325826822144
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
 * x-workflow: createPaymentCollectionForCartWorkflow
 * 
*/

