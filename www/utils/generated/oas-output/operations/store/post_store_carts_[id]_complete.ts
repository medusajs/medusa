/**
 * @oas [post] /store/carts/{id}/complete
 * operationId: PostCartsIdComplete
 * summary: Complete Cart
 * description: Complete a cart and place an order.
 * x-authenticated: false
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart
 *   description: "Storefront guide: How to implement cart completion during checkout."
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
 *       sdk.store.cart.complete("cart_123")
 *       .then((data) => {
 *         if(data.type === "cart") {
 *           // an error occurred
 *           console.log(data.error, data.cart)
 *         } else {
 *           // order placed successfully
 *           console.log(data.order)
 *         }
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/carts/{id}/complete' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Carts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           oneOf:
 *             - type: object
 *               description: The created order's details.
 *               required:
 *                 - type
 *                 - order
 *               properties:
 *                 type:
 *                   type: string
 *                   title: type
 *                   description: The type of the returned object. In this case, the order is returned because the cart was completed successfully.
 *                   default: order
 *                 order:
 *                   $ref: "#/components/schemas/StoreOrder"
 *             - type: object
 *               description: The details of why the cart completion failed.
 *               required:
 *                 - type
 *                 - cart
 *                 - error
 *               properties:
 *                 type:
 *                   type: string
 *                   title: type
 *                   description: The type of the returned object. In this case, the cart is returned because an error has occurred.
 *                   default: cart
 *                 cart:
 *                   $ref: "#/components/schemas/StoreCart"
 *                 error:
 *                   type: object
 *                   description: The error's details.
 *                   required:
 *                     - message
 *                     - name
 *                     - type
 *                   properties:
 *                     message:
 *                       type: string
 *                       title: message
 *                       description: The error's message.
 *                     name:
 *                       type: string
 *                       title: name
 *                       description: The error's name.
 *                     type:
 *                       type: string
 *                       title: type
 *                       description: >
 *                         The error's type. Can be a [MedusaError type](https://docs.medusajs.com/learn/fundamentals/api-routes/errors#medusaerror-types) or `payment_authorization_error` or
 *                         `payment_requires_more_error` for payment-related errors.
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
 * x-workflow: completeCartWorkflow
 * x-events:
 *   - name: order.placed
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the order
 *       }
 *       ```
 *     description: |-
 *       Emitted when an order is placed, or when a draft order is converted to an
 *       order.
 *     deprecated: false
 * 
*/

