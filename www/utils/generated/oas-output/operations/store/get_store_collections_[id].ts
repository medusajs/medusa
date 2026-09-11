/**
 * @oas [get] /store/collections/{id}
 * operationId: GetCollectionsId
 * summary: Get a Collection
 * description: Retrieve a collection by its ID. You can expand the collection's relations or select the fields that should be returned.
 * x-authenticated: false
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/products/collections/retrieve
 *   description: "Storefront guide: How to retrieve a collection."
 * parameters:
 *   - name: id
 *     in: path
 *     description: The collection's ID.
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
 *       sdk.store.collection.retrieve("pcol_123")
 *       .then(({ collection }) => {
 *         console.log(collection)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/collections/{id}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Collections
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCollectionResponse"
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
 * x-allowed:
 *   - id
 *   - title
 *   - handle
 *   - external_id
 *   - created_at
 *   - updated_at
 *   - products
 *   - metadata
 *   - deleted_at
 *   - products.id
 *   - products.title
 *   - products.subtitle
 *   - products.description
 *   - products.handle
 *   - products.is_giftcard
 *   - products.discountable
 *   - products.thumbnail
 *   - products.collection_id
 *   - products.type_id
 *   - products.weight
 *   - products.length
 *   - products.height
 *   - products.width
 *   - products.hs_code
 *   - products.origin_country
 *   - products.mid_code
 *   - products.material
 *   - products.created_at
 *   - products.updated_at
 *   - products.type
 *   - products.collection
 *   - products.options
 *   - products.options.values
 *   - products.tags
 *   - products.images
 *   - products.variants
 *   - products.variants.options
 *   - products.metadata
 *   - products.categories
 *   - products.status
 *   - products.external_id
 *   - products.deleted_at
 *   - products.variants.calculated_price
 *   - products.variants.inventory_quantity
 *   - products.variants.manage_inventory
 *   - products.variants.allow_backorder
 *   - products.variants.images
 *   - products.variants.thumbnail
 *   - products.variants.options.option
 *   - products.variants.inventory_items
 *   - products.variants.inventory_items.inventory_item_id
 *   - products.variants.inventory_items.required_quantity
 *   - products.variants.inventory_items.inventory
 *   - products.variants.inventory_items.inventory.location_levels
 *   - products.variants.prices
 *   - products.variants.id
 *   - products.variants.title
 *   - products.variants.sku
 *   - products.variants.barcode
 *   - products.variants.ean
 *   - products.variants.upc
 *   - products.variants.hs_code
 *   - products.variants.origin_country
 *   - products.variants.mid_code
 *   - products.variants.material
 *   - products.variants.weight
 *   - products.variants.length
 *   - products.variants.height
 *   - products.variants.width
 *   - products.variants.created_at
 *   - products.variants.updated_at
 *   - products.variants.deleted_at
 *   - products.variants.options.id
 *   - products.variants.options.value
 *   - products.options.id
 *   - products.options.title
 *   - products.options.is_exclusive
 *   - products.options.values.id
 *   - products.options.values.value
 *   - products.images.id
 *   - products.images.url
 *   - products.images.rank
 *   - products.type.id
 *   - products.type.value
 *   - products.type.created_at
 *   - products.type.updated_at
 *   - products.tags.id
 *   - products.tags.value
 *   - products.tags.created_at
 *   - products.tags.updated_at
 *   - products.collection.id
 *   - products.collection.title
 *   - products.collection.handle
 *   - products.collection.created_at
 *   - products.collection.updated_at
 *   - products.collection.deleted_at
 *   - products.collection.metadata
 * 
*/

