/**
 * @oas [get] /store/products/{id}
 * operationId: GetProductsId
 * summary: Get a Product
 * description: Retrieve a product by its ID. You can expand the product's relations or select the fields that should be returned.
 * x-authenticated: false
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/products/price
 *   description: "Storefront guide: How to retrieve a product variants' prices."
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
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
 *   - name: region_id
 *     in: query
 *     description: The ID of the region the product is being viewed from. This is required if you're retrieving product variant prices with taxes.
 *     required: false
 *     schema:
 *       type: string
 *       title: region_id
 *       description: The ID of the region the product is being viewed from. This is required if you're retrieving product variant prices with taxes.
 *       externalDocs:
 *         url: https://docs.medusajs.com/v2/resources/storefront-development/products/price/examples/tax-price
 *         description: "Storefront guide: How to show product variants' prices with taxes."
 *   - name: country_code
 *     in: query
 *     description: The country code the product is being viewed from. This is required if you're retrieving product variant prices with taxes.
 *     required: false
 *     schema:
 *       type: string
 *       title: country_code
 *       description: The country code the product is being viewed from. This is required if you're retrieving product variant prices with taxes.
 *   - name: province
 *     in: query
 *     description: The province the product is being viewed from. This is useful to narrow down the tax context when calculating product variant prices with taxes.
 *     required: false
 *     schema:
 *       type: string
 *       title: province
 *       description: The province the product is being viewed from. This is useful to narrow down the tax context when calculating product variant prices with taxes.
 *   - name: cart_id
 *     in: query
 *     description: The ID of the customer's cart. If set, the cart's region and shipping address's country code and province are used instead of the `region_id`, `country_code`, and `province` properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: cart_id
 *       description: The ID of the customer's cart. If set, the cart's region and shipping address's country code and province are used instead of the `region_id`, `country_code`, and `province` properties.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/products/{id}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductResponse"
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
 * 
*/

