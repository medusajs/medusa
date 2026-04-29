/**
 * @oas [post] /store/carts/{id}/line-items
 * operationId: PostCartsIdLineItems
 * summary: Add Line Item to Cart
 * x-sidebar-summary: Add Line Item
 * description: Add a product variant as a line item in the cart.
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/cart/manage-items#add-product-variant-to-cart
 *   description: "Storefront guide: How to add a product variant to the cart."
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
 *             description: The details of the line item to add.
 *             required:
 *               - variant_id
 *               - quantity
 *             properties:
 *               variant_id:
 *                 type: string
 *                 title: variant_id
 *                 description: The ID of the product variant to add as a line item.
 *               quantity:
 *                 type: number
 *                 title: quantity
 *                 description: The item's quantity.
 *               metadata:
 *                 type: object
 *                 description: The item's metadata, can hold custom key-value pairs.
 *           - type: object
 *             description: The details of the line item to add.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The details of the line item to add.
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
 *       sdk.store.cart.createLineItem("cart_123", {
 *         variant_id: "variant_123",
 *         quantity: 1
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/carts/{id}/line-items' \
 *       -H 'Content-Type: application/json' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
 *       --data-raw '{
 *         "variant_id": "{value}",
 *         "quantity": 3360689747918848,
 *         "metadata": {}
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
 * x-workflow: addToCartWorkflow
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

