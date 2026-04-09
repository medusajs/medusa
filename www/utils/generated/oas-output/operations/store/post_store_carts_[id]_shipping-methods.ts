/**
 * @oas [post] /store/carts/{id}/shipping-methods
 * operationId: PostCartsIdShippingMethods
 * summary: Add Shipping Method to Cart
 * x-sidebar-summary: Add Shipping Method
 * description: Add a shipping method to a cart. Use this API route when the customer chooses their preferred shipping option.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/checkout/shipping
 *   description: "Storefront guide: How to implement shipping during checkout."
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store#publishable-api-key
 *   - name: x-medusa-locale
 *     in: header
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
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
 *   - name: locale
 *     in: query
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         allOf:
 *           - type: object
 *             description: The shipping method's details.
 *             required:
 *               - option_id
 *             properties:
 *               option_id:
 *                 type: string
 *                 title: option_id
 *                 description: The ID of the shipping option to create the shipping method from.
 *               data:
 *                 type: object
 *                 description: Any additional data relevant for the third-party fulfillment provider to process the shipment.
 *                 externalDocs:
 *                   url: https://docs.medusajs.com/resources/storefront-development/checkout/shipping#data-request-body-parameter
 *                   description: Learn more about the data parameter.
 *           - type: object
 *             description: The shipping method's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The shipping method's details.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       let MEDUSA_BACKEND_URL = "http://localhost:9000"
 * 
 *       if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
 *         MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
 *       }
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: MEDUSA_BACKEND_URL,
 *         debug: process.env.NODE_ENV === "development",
 *         publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
 *       })
 * 
 *       sdk.store.cart.addShippingMethod("cart_123", {
 *         option_id: "so_123",
 *         data: {
 *           // custom data for fulfillment provider.
 *         }
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
 *       -H 'Content-Type: application/json' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
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
 * x-events:
 *   - name: cart.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the cart
 *       }
 *       ```
 *     description: Emitted when a cart's details are updated.
 *     deprecated: false
 * 
*/

