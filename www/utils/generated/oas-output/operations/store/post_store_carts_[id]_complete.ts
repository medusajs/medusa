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
 *                       description: |
 *                         The error's type. Can be a [MedusaError type](https://docs.medusajs.com/learn/fundamentals/api-routes/errors#medusaerror-types) or `payment_authorization_error` or `payment_requires_more_error` for payment-related errors.
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
 *   - name: reservation-item.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the reservation
 *         order_id, // (optional) The ID of the order, if the reservation was created by an order flow
 *       }
 *       ```
 *     description: Emitted when reservations are created.
 *     deprecated: false
 *     since: 2.18.0
 * x-allowed:
 *   - id
 *   - status
 *   - summary
 *   - currency_code
 *   - display_id
 *   - custom_display_id
 *   - region_id
 *   - email
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_subtotal
 *   - discount_tax_total
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - original_item_total
 *   - original_item_subtotal
 *   - original_item_tax_total
 *   - shipping_total
 *   - shipping_subtotal
 *   - shipping_tax_total
 *   - original_shipping_tax_total
 *   - original_shipping_subtotal
 *   - original_shipping_total
 *   - credit_line_total
 *   - credit_line_subtotal
 *   - credit_line_tax_total
 *   - created_at
 *   - updated_at
 *   - credit_lines
 *   - items
 *   - items.tax_lines
 *   - items.adjustments
 *   - items.detail
 *   - items.variant
 *   - items.variant.product
 *   - shipping_address
 *   - billing_address
 *   - shipping_methods
 *   - shipping_methods.tax_lines
 *   - shipping_methods.adjustments
 *   - payment_collections
 *   - customer_id
 *   - sales_channel_id
 *   - payment_status
 *   - fulfillment_status
 *   - item_discount_total
 *   - gift_card_total
 *   - gift_card_tax_total
 *   - shipping_discount_total
 *   - customer.id
 *   - customer.email
 *   - cart.id
 *   - items.metadata
 *   - items.product
 *   - payment_collections.payments
 *   - payment_collections.payment_sessions
 *   - payment_collections.payment_providers
 *   - fulfillments
 *   - promotions
 *   - promotions.id
 *   - promotions.code
 *   - promotions.is_automatic
 *   - promotions.is_tax_inclusive
 *   - promotions.application_method.value
 *   - promotions.application_method.type
 *   - promotions.application_method.currency_code
 *   - items.id
 *   - items.title
 *   - items.subtitle
 *   - items.thumbnail
 *   - items.variant_id
 *   - items.product_id
 *   - items.product_title
 *   - items.product_description
 *   - items.product_subtitle
 *   - items.product_type_id
 *   - items.product_type
 *   - items.product_collection
 *   - items.product_handle
 *   - items.variant_sku
 *   - items.variant_barcode
 *   - items.variant_title
 *   - items.variant_option_values
 *   - items.requires_shipping
 *   - items.is_discountable
 *   - items.is_tax_inclusive
 *   - items.unit_price
 *   - items.quantity
 *   - items.created_at
 *   - items.updated_at
 *   - items.original_total
 *   - items.original_subtotal
 *   - items.original_tax_total
 *   - items.item_total
 *   - items.item_subtotal
 *   - items.item_tax_total
 *   - items.total
 *   - items.subtotal
 *   - items.tax_total
 *   - items.discount_total
 *   - items.discount_tax_total
 *   - items.refundable_total
 *   - items.refundable_total_per_unit
 *   - items.detail.id
 *   - items.detail.item_id
 *   - items.detail.quantity
 *   - items.detail.fulfilled_quantity
 *   - items.detail.delivered_quantity
 *   - items.detail.shipped_quantity
 *   - items.detail.return_requested_quantity
 *   - items.detail.return_received_quantity
 *   - items.detail.return_dismissed_quantity
 *   - items.detail.written_off_quantity
 *   - items.detail.metadata
 *   - items.detail.created_at
 *   - items.detail.updated_at
 *   - items.tax_lines.id
 *   - items.tax_lines.code
 *   - items.tax_lines.rate
 *   - items.tax_lines.created_at
 *   - items.tax_lines.updated_at
 *   - items.tax_lines.item_id
 *   - items.tax_lines.total
 *   - items.tax_lines.subtotal
 *   - items.adjustments.id
 *   - items.adjustments.amount
 *   - items.adjustments.order_id
 *   - items.adjustments.created_at
 *   - items.adjustments.updated_at
 *   - items.adjustments.item_id
 *   - items.variant.id
 *   - items.variant.title
 *   - items.variant.sku
 *   - items.variant.barcode
 *   - items.variant.ean
 *   - items.variant.upc
 *   - items.variant.thumbnail
 *   - items.variant.allow_backorder
 *   - items.variant.manage_inventory
 *   - items.variant.hs_code
 *   - items.variant.origin_country
 *   - items.variant.mid_code
 *   - items.variant.material
 *   - items.variant.weight
 *   - items.variant.length
 *   - items.variant.height
 *   - items.variant.width
 *   - items.variant.created_at
 *   - items.variant.updated_at
 *   - items.variant.deleted_at
 *   - items.variant.options
 *   - items.variant.product.id
 *   - items.variant.product.title
 *   - items.variant.product.handle
 *   - items.variant.product.subtitle
 *   - items.variant.product.description
 *   - items.variant.product.is_giftcard
 *   - items.variant.product.status
 *   - items.variant.product.thumbnail
 *   - items.variant.product.width
 *   - items.variant.product.weight
 *   - items.variant.product.length
 *   - items.variant.product.height
 *   - items.variant.product.origin_country
 *   - items.variant.product.hs_code
 *   - items.variant.product.mid_code
 *   - items.variant.product.material
 *   - items.variant.product.collection_id
 *   - items.variant.product.type_id
 *   - items.variant.product.discountable
 *   - items.variant.product.external_id
 *   - items.variant.product.created_at
 *   - items.variant.product.updated_at
 *   - items.variant.product.deleted_at
 *   - items.variant.product.variants
 *   - items.variant.product.options
 *   - items.variant.product.images
 *   - shipping_address.id
 *   - shipping_address.metadata
 *   - shipping_address.created_at
 *   - shipping_address.updated_at
 *   - billing_address.id
 *   - billing_address.metadata
 *   - billing_address.created_at
 *   - billing_address.updated_at
 *   - shipping_methods.id
 *   - shipping_methods.order_id
 *   - shipping_methods.name
 *   - shipping_methods.amount
 *   - shipping_methods.is_tax_inclusive
 *   - shipping_methods.shipping_option_id
 *   - shipping_methods.data
 *   - shipping_methods.metadata
 *   - shipping_methods.original_total
 *   - shipping_methods.original_subtotal
 *   - shipping_methods.original_tax_total
 *   - shipping_methods.total
 *   - shipping_methods.subtotal
 *   - shipping_methods.tax_total
 *   - shipping_methods.discount_total
 *   - shipping_methods.discount_tax_total
 *   - shipping_methods.created_at
 *   - shipping_methods.updated_at
 *   - shipping_methods.tax_lines.id
 *   - shipping_methods.tax_lines.code
 *   - shipping_methods.tax_lines.rate
 *   - shipping_methods.tax_lines.created_at
 *   - shipping_methods.tax_lines.updated_at
 *   - shipping_methods.tax_lines.shipping_method_id
 *   - shipping_methods.tax_lines.total
 *   - shipping_methods.tax_lines.subtotal
 *   - shipping_methods.adjustments.id
 *   - shipping_methods.adjustments.amount
 *   - shipping_methods.adjustments.order_id
 *   - shipping_methods.adjustments.created_at
 *   - shipping_methods.adjustments.updated_at
 *   - shipping_methods.adjustments.shipping_method_id
 *   - payment_collections.id
 *   - payment_collections.currency_code
 *   - payment_collections.amount
 *   - payment_collections.status
 * 
*/

