/**
 * @oas [post] /store/carts/{id}/complete
 * operationId: PostCartsIdComplete
 * summary: Complete Cart
 * description: Complete a cart and place an order.
 * x-authenticated: false
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/checkout/complete-cart
 *   description: "Storefront guide: How to implement cart completion during checkout."
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
 * x-codeSamples:
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
 *                         The error's type. Can be a [MedusaError type](https://docs.medusajs.com/v2/advanced-development/api-routes/errors#medusaerror-types) or `payment_authorization_error` or
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
 * 
*/

