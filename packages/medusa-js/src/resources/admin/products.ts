import {
  AdminGetProductsParams,
  AdminGetProductsVariantsParams,
  AdminPostProductsProductMetadataReq,
  AdminPostProductsProductOptionsOption,
  AdminPostProductsProductOptionsReq,
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
  AdminPostProductsReq,
  AdminProductsDeleteOptionRes,
  AdminProductsDeleteRes,
  AdminProductsDeleteVariantRes,
  AdminProductsListRes,
  AdminProductsListTagsRes,
  AdminProductsListTypesRes,
  AdminProductsListVariantsRes,
  AdminProductsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

/**
 * This class is used to send requests to [Admin Product API Routes](https://docs.medusajs.com/api/admin#products). All its method
 * are available in the JS Client under the `medusa.admin.products` property.
 *
 * All methods in this class require {@link AdminAuthResource.createSession | user authentication}.
 *
 * Products are saleable items in a store. This also includes [saleable gift cards](https://docs.medusajs.com/modules/gift-cards/admin/manage-gift-cards#manage-gift-card-product) in a store.
 *
 * Related Guide: [How to manage products](https://docs.medusajs.com/modules/products/admin/manage-products).
 */
class AdminProductsResource extends BaseResource {
  /**
   * Create a new Product. This API Route can also be used to create a gift card if the `is_giftcard` field is set to `true`.
   * @param {AdminPostProductsReq} payload - The product to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.create({
   *   title: "Shirt",
   *   is_giftcard: false,
   *   discountable: true
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  create(
    payload: AdminPostProductsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Retrieve a product's details.
   * @param {string} id - The product's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.retrieve(productId)
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Update a Product's details.
   * @param {string} id - The product's ID.
   * @param {AdminPostProductsProductReq} payload - The attributes to update in a product.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.update(productId, {
   *   title: "Shirt",
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  update(
    id: string,
    payload: AdminPostProductsProductReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a product and its associated product variants and options.
   * @param {string} id - The product's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsDeleteRes>} Resolves to the deletion operation's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.delete(productId)
   * .then(({ id, object, deleted }) => {
   *   console.log(id);
   * })
   */
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteRes> {
    const path = `/admin/products/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of products. The products can be filtered by fields such as `q` or `status` passed in the `query` parameter. The products can also be sorted or paginated.
   * @param {AdminGetProductsParams} query - Filters and pagination configurations to apply on the retrieved products.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsListRes>} Resolves to the list of products with pagination fields.
   *
   * @example
   * To list products:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.list()
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   *
   * To specify relations that should be retrieved within the products:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.list({
   *   expand: "images"
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   *
   * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   *
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.list({
   *   expand: "images",
   *   limit,
   *   offset
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   */
  list(
    query?: AdminGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListRes> {
    let path = `/admin/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/products?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * @ignore
   *
   * @deprecated Use {@link AdminProductTypesResource.list} instead.
   */
  listTypes(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListTypesRes> {
    const path = `/admin/products/types`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Retrieve a list of Product Tags with how many times each is used in products.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsListTagsRes>} Resolves to the list of tags.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.listTags()
   * .then(({ tags }) => {
   *   console.log(tags.length);
   * })
   */
  listTags(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListTagsRes> {
    const path = `/admin/products/tag-usage`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Set the metadata of a product. It can be any key-value pair, which allows adding custom data to a product. Learn about how you can update and delete the metadata attribute
   * [here](https://docs.medusajs.com/development/entities/overview#metadata-attribute).
   * @param {string} id - The product's ID.
   * @param {AdminPostProductsProductMetadataReq} payload - The metadata details to add, update, or delete.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.setMetadata(productId, {
   *   key: "test",
   *   value: "true"
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  setMetadata(
    id: string,
    payload: AdminPostProductsProductMetadataReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/metadata`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Create a product variant associated with a product. Each product variant must have a unique combination of product option values.
   * @param {string} id - The ID of the product that the variant belongs to.
   * @param {AdminPostProductsProductVariantsReq} payload - The product variant to create.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details. You can access the variant under the `variants` property.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.createVariant(productId, {
   *   title: "Color",
   *   prices: [
   *     {
   *       amount: 1000,
   *       currency_code: "eur"
   *     }
   *   ],
   *   options: [
   *     {
   *       option_id,
   *       value: "S"
   *     }
   *   ],
   *   inventory_quantity: 100
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  createVariant(
    id: string,
    payload: AdminPostProductsProductVariantsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a product variant's details.
   * @param {string} id - The ID of the product that the variant belongs to.
   * @param {string} variantId - The ID of the product variant.
   * @param {AdminPostProductsProductVariantsVariantReq} payload - The attributes to update in the product variant.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details. You can access the variant under the `variants` property.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.updateVariant(productId, variantId, {
   *   title: "Color",
   *   prices: [
   *     {
   *       amount: 1000,
   *       currency_code: "eur"
   *     }
   *   ],
   *   options: [
   *     {
   *       option_id,
   *       value: "S"
   *     }
   *   ],
   *   inventory_quantity: 100
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  updateVariant(
    id: string,
    variantId: string,
    payload: AdminPostProductsProductVariantsVariantReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a product variant.
   * @param {string} id - The ID of the product that the variant belongs to.
   * @param {string} variantId - The ID of the product variant.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsDeleteVariantRes>} Resolves to the deletion operation's details.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.deleteVariant(productId, variantId)
   * .then(({ variant_id, object, deleted, product }) => {
   *   console.log(product.id);
   * })
   */
  deleteVariant(
    id: string,
    variantId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteVariantRes> {
    const path = `/admin/products/${id}/variants/${variantId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }

  /**
   * List the product variants associated with a product. The product variants can be filtered by fields such as `q` or `manage_inventory` passed in the `query` parameter. The product variants can also be sorted or paginated.
   * @param {string} id - The ID of the product that the variants belongs to.
   * @param {AdminGetProductsVariantsParams} query - Filters and pagination configurations to apply on the retrieved product variants. If undefined, the first 100 records are retrieved.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsListVariantsRes>} Resolves to the list of product variants with pagination fields.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.listVariants(productId, {
   *   limit: 10,
   * })
   * .then(({ variants, limit, offset, count }) => {
   *  console.log(variants.length);
   * })
   */
  listVariants(
    id: string,
    query?: AdminGetProductsVariantsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsListVariantsRes> {
    let path = `/admin/products/${id}/variants`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/admin/products/${id}/variants?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Add a product option to a product.
   * @param {string} id - The product's ID.
   * @param {AdminPostProductsProductOptionsReq} payload - The option to add.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details. You can access the variant under the `options` property.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.addOption(productId, {
   *   title: "Size"
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  addOption(
    id: string,
    payload: AdminPostProductsProductOptionsReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Update a product option's details.
   * @param {string} id - The ID of the product that the option belongs to.
   * @param {string} optionId - The ID of the product option.
   * @param {AdminPostProductsProductOptionsOption} payload - The attributes to update in the product option.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsRes>} Resolves to the product's details. You can access the variant under the `options` property.
   *
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * // must be previously logged in or use api token
   * medusa.admin.products.updateOption(productId, optionId, {
   *   title: "Size"
   * })
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  updateOption(
    id: string,
    optionId: string,
    payload: AdminPostProductsProductOptionsOption,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("POST", path, payload, {}, customHeaders)
  }

  /**
   * Delete a product option. If there are product variants that use this product option, they must be deleted before deleting the product option.
   * @param {string} id - The ID of the product that the option belongs to.
   * @param {string} optionId - The ID of the product option.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<AdminProductsDeleteOptionRes>} Resolves to the deletion operation's details.
   */
  deleteOption(
    id: string,
    optionId: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminProductsDeleteOptionRes> {
    const path = `/admin/products/${id}/options/${optionId}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminProductsResource
