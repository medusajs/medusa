/**
 * @oas [post] /store/carts/{id}/shipping-methods
 * operationId: PostCartsIdShippingMethods
 * summary: Add Shipping Method to Cart
 * x-sidebar-summary: Add Shipping Method
 * description: |
 *   Add a shipping method to a cart. Use this API route when the customer chooses their preferred shipping option.
 * 
 *   If the chosen shipping option's `price_type` is `calculated`, its price is computed by the associated fulfillment provider when it's added to the cart. If the provider fails to calculate the price, this route returns an error.
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
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         oneOf:
 *           - allOf:
 *               - $ref: "#/components/schemas/StoreAddCartShippingMethodsBase"
 *               - type: object
 *                 description: The shipping method's details.
 *                 properties:
 *                   additional_data:
 *                     type: object
 *                     description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *           - allOf:
 *               - type: array
 *                 description: An array of shipping methods to add to the cart.
 *                 items:
 *                   $ref: "#/components/schemas/StoreAddCartShippingMethodsBase"
 *               - type: object
 *                 description: The shipping method's details.
 *                 properties:
 *                   additional_data:
 *                     type: object
 *                     description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
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
 * x-allowed:
 *   - id
 *   - currency_code
 *   - email
 *   - locale
 *   - region_id
 *   - created_at
 *   - updated_at
 *   - completed_at
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_subtotal
 *   - discount_tax_total
 *   - original_total
 *   - original_tax_total
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - item_discount_total
 *   - original_item_total
 *   - original_item_subtotal
 *   - original_item_tax_total
 *   - shipping_total
 *   - shipping_subtotal
 *   - shipping_tax_total
 *   - shipping_discount_total
 *   - original_shipping_tax_total
 *   - original_shipping_subtotal
 *   - original_shipping_total
 *   - credit_line_subtotal
 *   - credit_line_tax_total
 *   - credit_line_total
 *   - metadata
 *   - sales_channel_id
 *   - promotions.id
 *   - promotions.code
 *   - promotions.is_automatic
 *   - promotions.is_tax_inclusive
 *   - promotions.application_method.value
 *   - promotions.application_method.type
 *   - promotions.application_method.currency_code
 *   - items.id
 *   - items.thumbnail
 *   - items.product
 *   - items.product.id
 *   - items.variant
 *   - items.variant_id
 *   - items.product_id
 *   - items.is_giftcard
 *   - items.product.categories.id
 *   - items.product.tags.id
 *   - items.product.collection_id
 *   - items.product.type_id
 *   - items.product_type_id
 *   - items.product_title
 *   - items.product_description
 *   - items.product_subtitle
 *   - items.product_type
 *   - items.product_collection
 *   - items.product_handle
 *   - items.variant_sku
 *   - items.variant_barcode
 *   - items.variant_title
 *   - items.requires_shipping
 *   - items.metadata
 *   - items.created_at
 *   - items.updated_at
 *   - items.title
 *   - items.quantity
 *   - items.unit_price
 *   - items.compare_at_unit_price
 *   - items.is_tax_inclusive
 *   - items.tax_lines.id
 *   - items.tax_lines.description
 *   - items.tax_lines.code
 *   - items.tax_lines.rate
 *   - items.tax_lines.provider_id
 *   - items.tax_lines.data
 *   - items.tax_lines.metadata
 *   - items.adjustments.id
 *   - items.adjustments.code
 *   - items.adjustments.promotion_id
 *   - items.adjustments.amount
 *   - items.adjustments.is_tax_inclusive
 *   - customer.id
 *   - customer.email
 *   - customer.groups.id
 *   - shipping_methods.tax_lines.id
 *   - shipping_methods.tax_lines.description
 *   - shipping_methods.tax_lines.code
 *   - shipping_methods.tax_lines.rate
 *   - shipping_methods.tax_lines.provider_id
 *   - shipping_methods.tax_lines.data
 *   - shipping_methods.tax_lines.metadata
 *   - shipping_methods.amount
 *   - shipping_methods.is_tax_inclusive
 *   - shipping_methods.adjustments.id
 *   - shipping_methods.adjustments.code
 *   - shipping_methods.adjustments.amount
 *   - shipping_methods.shipping_option_id
 *   - shipping_address_id
 *   - shipping_address.id
 *   - shipping_address.first_name
 *   - shipping_address.last_name
 *   - shipping_address.company
 *   - shipping_address.address_1
 *   - shipping_address.address_2
 *   - shipping_address.city
 *   - shipping_address.postal_code
 *   - shipping_address.country_code
 *   - shipping_address.region_code
 *   - shipping_address.province
 *   - shipping_address.phone
 *   - billing_address_id
 *   - billing_address.id
 *   - billing_address.first_name
 *   - billing_address.last_name
 *   - billing_address.company
 *   - billing_address.address_1
 *   - billing_address.address_2
 *   - billing_address.city
 *   - billing_address.postal_code
 *   - billing_address.country_code
 *   - billing_address.region_code
 *   - billing_address.province
 *   - billing_address.phone
 *   - region.id
 *   - region.name
 *   - region.currency_code
 *   - region.automatic_taxes
 *   - region.countries
 *   - payment_collection
 *   - payment_collection.payment_sessions
 *   - credit_lines
 *   - items
 *   - region
 *   - promotions
 *   - customer
 *   - shipping_methods
 *   - shipping_address
 *   - billing_address
 *   - items.total
 *   - items.subtotal
 *   - items.tax_total
 *   - items.discount_total
 *   - items.discount_tax_total
 *   - items.original_total
 *   - items.original_subtotal
 *   - items.original_tax_total
 *   - items.item_total
 *   - items.item_subtotal
 *   - items.item_tax_total
 *   - shipping_methods.name
 *   - payment_collection.payment_sessions.data
 *   - original_subtotal
 *   - gift_card_total
 *   - gift_card_tax_total
 *   - items.cart_id
 *   - items.is_discountable
 *   - items.tax_lines
 *   - items.tax_lines.item_id
 *   - items.tax_lines.total
 *   - items.tax_lines.subtotal
 *   - items.tax_lines.tax_rate_id
 *   - items.tax_lines.created_at
 *   - items.tax_lines.updated_at
 *   - items.adjustments
 *   - items.adjustments.cart_id
 *   - items.adjustments.item_id
 *   - items.adjustments.description
 *   - items.adjustments.provider_id
 *   - items.adjustments.created_at
 *   - items.adjustments.updated_at
 *   - shipping_methods.id
 *   - shipping_methods.cart_id
 *   - shipping_methods.description
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
 *   - shipping_methods.tax_lines
 *   - shipping_methods.tax_lines.shipping_method_id
 *   - shipping_methods.tax_lines.total
 *   - shipping_methods.tax_lines.subtotal
 *   - shipping_methods.tax_lines.tax_rate_id
 *   - shipping_methods.tax_lines.created_at
 *   - shipping_methods.tax_lines.updated_at
 *   - shipping_methods.adjustments
 *   - shipping_methods.adjustments.cart_id
 *   - shipping_methods.adjustments.shipping_method_id
 *   - shipping_methods.adjustments.description
 *   - shipping_methods.adjustments.provider_id
 *   - shipping_methods.adjustments.promotion_id
 *   - shipping_methods.adjustments.created_at
 *   - shipping_methods.adjustments.updated_at
 *   - shipping_address.created_at
 *   - shipping_address.updated_at
 *   - billing_address.created_at
 *   - billing_address.updated_at
 *   - region.countries.id
 *   - payment_collection.id
 *   - payment_collection.currency_code
 *   - payment_collection.amount
 *   - payment_collection.status
 *   - payment_collection.payment_providers
 *   - payment_collection.payment_providers.id
 *   - payment_collection.payment_sessions.id
 *   - payment_collection.payment_sessions.amount
 *   - payment_collection.payment_sessions.currency_code
 *   - payment_collection.payment_sessions.provider_id
 *   - payment_collection.payment_sessions.status
 * 
*/

