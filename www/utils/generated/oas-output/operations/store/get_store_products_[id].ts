/**
 * @oas [get] /store/products/{id}
 * operationId: GetProductsId
 * summary: Get a Product
 * description: Retrieve a product by its ID. You can expand the product's relations or select the fields that should be returned.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
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
 *   - name: region_id
 *     in: query
 *     description: The product's region id.
 *     required: false
 *     schema:
 *       type: string
 *       title: region_id
 *       description: The product's region id.
 *   - name: country_code
 *     in: query
 *     description: The product's country code.
 *     required: false
 *     schema:
 *       type: string
 *       title: country_code
 *       description: The product's country code.
 *   - name: province
 *     in: query
 *     description: The product's province.
 *     required: false
 *     schema:
 *       type: string
 *       title: province
 *       description: The product's province.
 *   - name: cart_id
 *     in: query
 *     description: The product's cart id.
 *     required: false
 *     schema:
 *       type: string
 *       title: cart_id
 *       description: The product's cart id.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/products/{id}'
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

