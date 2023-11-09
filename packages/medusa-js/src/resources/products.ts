import {
  StoreGetProductsParams,
  StorePostSearchReq,
  StorePostSearchRes,
  StoreProductsListRes,
  StoreProductsRes,
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../typings"
import BaseResource from "./base"
import ProductVariantsResource from "./product-variants"

/**
 * This class is used to send requests to [Store Product API Routes](https://docs.medusajs.com/api/store#products). All its method
 * are available in the JS Client under the `medusa.products` property.
 * 
 * Products are saleable items in a store. This also includes [saleable gift cards](https://docs.medusajs.com/modules/gift-cards/storefront/use-gift-cards) in a store.
 * Using the methods in this class, you can filter products by categories, collections, sales channels, and more.
 * 
 * Related Guide: [How to show products in a storefront](https://docs.medusajs.com/modules/products/storefront/show-products).
 */
class ProductsResource extends BaseResource {
  /**
   * An instance of {@link ProductVariantsResource} used to send requests to [Store Product Variant API Routes](https://docs.medusajs.com/api/store#product-variants_getvariants).
   */
  public variants = new ProductVariantsResource(this.client)

  /**
   * Retrieve a Product's details. For accurate and correct pricing of the product based on the customer's context, it's highly recommended to pass fields such as
   * `region_id`, `currency_code`, and `cart_id` when available.
   * 
   * Passing `sales_channel_id` ensures retrieving only products available in the current sales channel.
   * You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
   * @param {string} id - The product's ID.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreProductsRes>} Resolves to the product's details.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.products.retrieve(productId)
   * .then(({ product }) => {
   *   console.log(product.id);
   * })
   */
  retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductsRes> {
    const path = `/store/products/${id}`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }

  /**
   * Run a search query on products using the search service installed on the Medusa backend. The searching is handled through the search service, so the returned data's
   * format depends on the search service you're using.
   * @param {StorePostSearchReq} searchOptions - Fields to search products.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StorePostSearchRes>} Resolves to the list of search results. The format of the items depends on the search engine installed on the Medusa backend.
   * 
   * @example
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.products.search({
   *   q: "Shirt"
   * })
   * .then(({ hits }) => {
   *   console.log(hits.length);
   * })
   */
  search(
    searchOptions: StorePostSearchReq,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StorePostSearchRes> {
    const path = `/store/products/search`
    return this.client.request("POST", path, searchOptions, {}, customHeaders)
  }

  /**
   * Retrieves a list of products. The products can be filtered by fields such as `id` or `q` passed in the `query` parameter. The products can also be sorted or paginated.
   * This method can also be used to retrieve a product by its handle.
   * 
   * For accurate and correct pricing of the products based on the customer's context, it's highly recommended to pass fields such as
   * `region_id`, `currency_code`, and `cart_id` when available.
   * 
   * Passing `sales_channel_id` ensures retrieving only products available in the specified sales channel.
   * You can alternatively use a publishable API key in the request header instead of passing a `sales_channel_id`.
   * @param {StoreGetProductsParams} query - Filters and pagination configurations to apply on the retrieved products.
   * @param {Record<string, any>} customHeaders - Custom headers to attach to the request.
   * @returns {ResponsePromise<StoreProductsListRes>} Resolves to the list of products with pagination fields.
   * 
   * @example
   * To list products:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.products.list()
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
   * medusa.products.list({
   *   expand: "variants"
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   * 
   * By default, only the first `100` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
   * 
   * ```ts
   * import Medusa from "@medusajs/medusa-js"
   * const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
   * medusa.products.list({
   *   expand: "variants",
   *   limit,
   *   offset
   * })
   * .then(({ products, limit, offset, count }) => {
   *   console.log(products.length);
   * })
   * ```
   */
  list(
    query?: StoreGetProductsParams,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<StoreProductsListRes> {
    let path = `/store/products`

    if (query) {
      const queryString = qs.stringify(query)
      path = `/store/products?${queryString}`
    }

    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}

export default ProductsResource
