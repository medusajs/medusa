/**
 * @oas [get] /store/product-categories/{id}
 * operationId: GetProductCategoriesId
 * summary: Get a Product Category
 * description: Retrieve a product category by its ID. You can expand the product category's relations or select the fields that should be returned.
 * x-authenticated: false
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/products/categories/retrieve
 *   description: "Storefront guide: How to retrieve a product category."
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product category's ID.
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
 *   - name: include_ancestors_tree
 *     in: query
 *     description: Whether to retrieve the category's parent. If you enable this, add to the `fields` query parameter `parent_category` to set the parent of a category in this field. You can either pass
 *       `*parent_category` to retreieve the fields of all parent categories, or select specific fields to make the response size smaller. For example, `fields=parent_category.id,parent_category.name`.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: include_ancestors_tree
 *       description: Whether to retrieve the category's parent. If you enable this, add to the `fields` query parameter `parent_category` to set the parent of a category in this field. You can either pass
 *         `*parent_category` to retreieve the fields of all parent categories, or select specific fields to make the response size smaller. For example, `fields=parent_category.id,parent_category.name`.
 *   - name: include_descendants_tree
 *     in: query
 *     description: Whether to retrieve a list of child categories. If you enable this, add to the `fields` query parameter `category_children` to set the children of a category in this field. You can either
 *       pass `*category_children` to retreieve the fields of all child categories, or select specific fields to make the response size smaller. For example,
 *       `fields=category_children.id,category_children.name`.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: include_descendants_tree
 *       description: Whether to retrieve a list of child categories. If you enable this, add to the `fields` query parameter `category_children` to set the children of a category in this field. You can either
 *         pass `*category_children` to retreieve the fields of all child categories, or select specific fields to make the response size smaller. For example,
 *         `fields=category_children.id,category_children.name`.
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
 *       sdk.store.category.retrieve("pcat_123")
 *       .then(({ product_category }) => {
 *         console.log(product_category)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/product-categories/{id}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Product Categories
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreProductCategoryResponse"
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
 *   - name
 *   - description
 *   - handle
 *   - rank
 *   - external_id
 *   - parent_category_id
 *   - created_at
 *   - updated_at
 *   - metadata
 *   - parent_category
 *   - category_children
 *   - products
 *   - deleted_at
 *   - products.title
 *   - products.variants
 *   - products.options
 *   - products.images
 *   - category_children.products.title
 *   - parent_category.id
 *   - parent_category.name
 *   - parent_category.description
 *   - parent_category.handle
 *   - parent_category.rank
 *   - parent_category.external_id
 *   - parent_category.parent_category_id
 *   - parent_category.created_at
 *   - parent_category.updated_at
 *   - parent_category.deleted_at
 *   - category_children.id
 *   - category_children.name
 *   - category_children.description
 *   - category_children.handle
 *   - category_children.rank
 *   - category_children.external_id
 *   - category_children.parent_category_id
 *   - category_children.created_at
 *   - category_children.updated_at
 *   - category_children.deleted_at
 *   - parent_category.parent_category
 *   - parent_category.category_children
 *   - category_children.parent_category
 *   - category_children.category_children
 *   - parent_category.parent_category.id
 *   - parent_category.parent_category.name
 *   - parent_category.parent_category.description
 *   - parent_category.parent_category.handle
 *   - parent_category.parent_category.rank
 *   - parent_category.parent_category.external_id
 *   - parent_category.parent_category.parent_category_id
 *   - parent_category.parent_category.created_at
 *   - parent_category.parent_category.updated_at
 *   - parent_category.parent_category.deleted_at
 *   - parent_category.category_children.id
 *   - parent_category.category_children.name
 *   - parent_category.category_children.description
 *   - parent_category.category_children.handle
 *   - parent_category.category_children.rank
 *   - parent_category.category_children.external_id
 *   - parent_category.category_children.parent_category_id
 *   - parent_category.category_children.created_at
 *   - parent_category.category_children.updated_at
 *   - parent_category.category_children.deleted_at
 *   - category_children.parent_category.id
 *   - category_children.parent_category.name
 *   - category_children.parent_category.description
 *   - category_children.parent_category.handle
 *   - category_children.parent_category.rank
 *   - category_children.parent_category.external_id
 *   - category_children.parent_category.parent_category_id
 *   - category_children.parent_category.created_at
 *   - category_children.parent_category.updated_at
 *   - category_children.parent_category.deleted_at
 *   - category_children.category_children.id
 *   - category_children.category_children.name
 *   - category_children.category_children.description
 *   - category_children.category_children.handle
 *   - category_children.category_children.rank
 *   - category_children.category_children.external_id
 *   - category_children.category_children.parent_category_id
 *   - category_children.category_children.created_at
 *   - category_children.category_children.updated_at
 *   - category_children.category_children.deleted_at
 *   - parent_category.parent_category.parent_category
 *   - parent_category.parent_category.category_children
 *   - parent_category.category_children.parent_category
 *   - parent_category.category_children.category_children
 *   - category_children.parent_category.parent_category
 *   - category_children.parent_category.category_children
 *   - category_children.category_children.parent_category
 *   - category_children.category_children.category_children
 *   - parent_category.parent_category.parent_category.id
 *   - parent_category.parent_category.parent_category.name
 *   - parent_category.parent_category.parent_category.description
 *   - parent_category.parent_category.parent_category.handle
 *   - parent_category.parent_category.parent_category.rank
 *   - parent_category.parent_category.parent_category.external_id
 *   - parent_category.parent_category.parent_category.parent_category_id
 *   - parent_category.parent_category.parent_category.created_at
 *   - parent_category.parent_category.parent_category.updated_at
 *   - parent_category.parent_category.parent_category.deleted_at
 *   - parent_category.parent_category.category_children.id
 *   - parent_category.parent_category.category_children.name
 *   - parent_category.parent_category.category_children.description
 *   - parent_category.parent_category.category_children.handle
 *   - parent_category.parent_category.category_children.rank
 *   - parent_category.parent_category.category_children.external_id
 *   - parent_category.parent_category.category_children.parent_category_id
 *   - parent_category.parent_category.category_children.created_at
 *   - parent_category.parent_category.category_children.updated_at
 *   - parent_category.parent_category.category_children.deleted_at
 *   - parent_category.category_children.parent_category.id
 *   - parent_category.category_children.parent_category.name
 *   - parent_category.category_children.parent_category.description
 *   - parent_category.category_children.parent_category.handle
 *   - parent_category.category_children.parent_category.rank
 *   - parent_category.category_children.parent_category.external_id
 *   - parent_category.category_children.parent_category.parent_category_id
 *   - parent_category.category_children.parent_category.created_at
 *   - parent_category.category_children.parent_category.updated_at
 *   - parent_category.category_children.parent_category.deleted_at
 *   - parent_category.category_children.category_children.id
 *   - parent_category.category_children.category_children.name
 *   - parent_category.category_children.category_children.description
 *   - parent_category.category_children.category_children.handle
 *   - parent_category.category_children.category_children.rank
 *   - parent_category.category_children.category_children.external_id
 *   - parent_category.category_children.category_children.parent_category_id
 *   - parent_category.category_children.category_children.created_at
 *   - parent_category.category_children.category_children.updated_at
 *   - parent_category.category_children.category_children.deleted_at
 *   - category_children.parent_category.parent_category.id
 *   - category_children.parent_category.parent_category.name
 *   - category_children.parent_category.parent_category.description
 *   - category_children.parent_category.parent_category.handle
 *   - category_children.parent_category.parent_category.rank
 *   - category_children.parent_category.parent_category.external_id
 *   - category_children.parent_category.parent_category.parent_category_id
 *   - category_children.parent_category.parent_category.created_at
 *   - category_children.parent_category.parent_category.updated_at
 *   - category_children.parent_category.parent_category.deleted_at
 *   - category_children.parent_category.category_children.id
 *   - category_children.parent_category.category_children.name
 *   - category_children.parent_category.category_children.description
 *   - category_children.parent_category.category_children.handle
 *   - category_children.parent_category.category_children.rank
 *   - category_children.parent_category.category_children.external_id
 *   - category_children.parent_category.category_children.parent_category_id
 *   - category_children.parent_category.category_children.created_at
 *   - category_children.parent_category.category_children.updated_at
 *   - category_children.parent_category.category_children.deleted_at
 *   - category_children.category_children.parent_category.id
 *   - category_children.category_children.parent_category.name
 *   - category_children.category_children.parent_category.description
 *   - category_children.category_children.parent_category.handle
 *   - category_children.category_children.parent_category.rank
 *   - category_children.category_children.parent_category.external_id
 *   - category_children.category_children.parent_category.parent_category_id
 *   - category_children.category_children.parent_category.created_at
 *   - category_children.category_children.parent_category.updated_at
 *   - category_children.category_children.parent_category.deleted_at
 *   - category_children.category_children.category_children.id
 *   - category_children.category_children.category_children.name
 *   - category_children.category_children.category_children.description
 *   - category_children.category_children.category_children.handle
 *   - category_children.category_children.category_children.rank
 *   - category_children.category_children.category_children.external_id
 *   - category_children.category_children.category_children.parent_category_id
 *   - category_children.category_children.category_children.created_at
 *   - category_children.category_children.category_children.updated_at
 *   - category_children.category_children.category_children.deleted_at
 * 
*/

