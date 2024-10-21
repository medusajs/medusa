/**
 * @oas [post] /store/carts/{id}/shipping-methods
 * operationId: PostCartsIdShippingMethods
 * summary: Add Shipping Method to Cart
 * x-sidebar-summary: Add Shipping Method
 * description: Add a shipping method to a cart. Use this API route when the customer chooses their preferred shipping option.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/checkout/shipping
 *   description: "Storefront guide: How to implement shipping during checkout."
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The shipping method's details.
 *         required:
 *           - option_id
 *         properties:
 *           option_id:
 *             type: string
 *             title: option_id
 *             description: The ID of the shipping option this method is created from.
 *           data:
 *             type: object
 *             description: Any additional data relevant for the third-party fulfillment provider to process the shipment.
 *             externalDocs:
 *               url: https://docs.medusajs.com/v2/resources/storefront-development/checkout/shipping#data-request-body-parameter
 *               description: Learn more about the data parameter.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
 *       -H 'Content-Type: application/json' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 *       --data-raw '{
 *         "option_id": "{value}"
 *       }'
 * tags:
 *   - Carts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartResponse"
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
 * x-workflow: addShippingMethodToCartWorkflow
 * 
*/

