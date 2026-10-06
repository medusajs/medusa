/**
 * @oas [post] /store/shipping-options/{id}/calculate
 * operationId: PostShippingOptionsIdCalculate
 * summary: Calculate Shipping Option Price
 * description: |
 *   Calculate the price of a shipping option in a cart. Use this API route for shipping options whose `price_type` is `calculated`, as their price isn't stored but computed on the fly by the associated fulfillment provider against the cart.
 * 
 *   If the fulfillment provider fails to calculate the price, this route returns an error.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option's ID.
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
 *         type: object
 *         description: The calculation's details.
 *         required:
 *           - cart_id
 *         properties:
 *           cart_id:
 *             type: string
 *             title: cart_id
 *             description: The ID of the cart the shipping option is used in.
 *           data:
 *             type: object
 *             description: Custom data that's useful for the fulfillment provider to calculate the price.
 *             externalDocs:
 *               url: https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property
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
 *       sdk.store.fulfillment.calculate("so_123", {
 *         cart_id: "cart_123"
 *       })
 *       .then(({ shipping_option }) => {
 *         console.log(shipping_option)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/shipping-options/{id}/calculate' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "cart_id": "cart_123"
 *       }'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreShippingOptionResponse"
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
 * x-workflow: calculateShippingOptionsPricesWorkflow
 * x-events: []
 * x-allowed:
 *   - id
 *   - name
 *   - price_type
 *   - service_zone_id
 *   - shipping_profile_id
 *   - provider_id
 *   - shipping_option_type_id
 *   - metadata
 *   - data
 *   - type
 *   - type.id
 *   - type.label
 *   - type.description
 *   - type.code
 *   - provider
 *   - provider.id
 *   - provider.is_enabled
 *   - prices
 *   - prices.id
 *   - prices.currency_code
 *   - prices.amount
 *   - prices.min_quantity
 *   - prices.max_quantity
 *   - prices.price_rules
 *   - prices.price_rules.id
 *   - prices.price_rules.attribute
 *   - prices.price_rules.operator
 *   - prices.price_rules.value
 *   - calculated_price
 *   - calculated_price.id
 *   - calculated_price.currency_code
 *   - calculated_price.calculated_amount
 *   - calculated_price.calculated_amount_with_tax
 *   - calculated_price.calculated_amount_without_tax
 *   - calculated_price.original_amount
 *   - calculated_price.original_amount_with_tax
 *   - calculated_price.original_amount_without_tax
 *   - calculated_price.is_calculated_price_price_list
 *   - calculated_price.is_calculated_price_tax_inclusive
 *   - calculated_price.is_original_price_price_list
 *   - calculated_price.is_original_price_tax_inclusive
 *   - calculated_price.calculated_price
 *   - calculated_price.calculated_price.id
 *   - calculated_price.calculated_price.price_list_id
 *   - calculated_price.calculated_price.price_list_type
 *   - calculated_price.calculated_price.min_quantity
 *   - calculated_price.calculated_price.max_quantity
 *   - calculated_price.original_price
 *   - calculated_price.original_price.id
 *   - calculated_price.original_price.price_list_id
 *   - calculated_price.original_price.price_list_type
 *   - calculated_price.original_price.min_quantity
 *   - calculated_price.original_price.max_quantity
 * 
*/

