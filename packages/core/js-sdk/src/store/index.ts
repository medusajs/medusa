import {
  FindParams,
  HttpTypes,
  SelectParams,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Store {
  /**
   * @ignore
   */
  private client: Client

  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  public region = {
    /**
     * This method retrieves the paginated list of regions in the store. It sends a request to the 
     * [List Regions API route](https://docs.medusajs.com/api/store#regions_getregions).
     * 
     * Related guide: [How to list regions in a storefront](https://docs.medusajs.com/resources/storefront-development/regions/list).
     * 
     * @param query - Filters and pagination configurations.
     * @param headers - Headers to pass in the request
     * @returns The paginated list of regions.
     * 
     * @example
     * To retrieve the list of regions:
     * 
     * ```ts
     * sdk.store.region.list()
     * .then(({ regions, count, limit, offset }) => {
     *   console.log(regions)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.region.list({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ regions, count, limit, offset }) => {
     *   console.log(regions)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each region:
     * 
     * ```ts
     * sdk.store.region.list({
     *   fields: "id,*countries"
     * })
     * .then(({ regions, count, limit, offset }) => {
     *   console.log(regions)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    list: async (
      query?: FindParams & HttpTypes.StoreRegionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreRegionListResponse
      >(`/store/regions`, {
        query,
        headers,
      })
    },
    /**
     * This method retrieves a region by its ID. It sends a request to the [Get Region](https://docs.medusajs.com/api/store#regions_getregionsid)
     * API route.
     * 
     * Related guide: [Store and retrieve regions in a storefront](https://docs.medusajs.com/resources/storefront-development/regions/store-retrieve-region).
     * 
     * @param id - The region's ID.
     * @param query - Configure the fields to retrieve in the region.
     * @param headers - Headers to pass in the request
     * @returns The region.
     * 
     * @example
     * To retrieve a region by its ID:
     * 
     * ```ts
     * sdk.store.region.retrieve("reg_123")
     * .then(({ region }) => {
     *   console.log(region)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.region.retrieve(
     *   "reg_123",
     *   {
     *     fields: "id,*countries"
     *   }
     * )
     * .then(({ region }) => {
     *   console.log(region)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreRegionResponse>(
        `/store/regions/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public collection = {
    /**
     * This method retrieves a paginated list of product collections. It sends a request to the
     * [List Collections](https://docs.medusajs.com/api/store#collections_getcollections) API route.
     * 
     * Related guide: [How to retrieve collections in a storefront](https://docs.medusajs.com/resources/storefront-development/products/collections/list).
     * 
     * @param query - Filters and pagination configurations.
     * @param headers - Headers to pass in the request
     * @returns The paginated list of collections.
     * 
     * @example
     * To retrieve the list of collections:
     * 
     * ```ts
     * sdk.store.collection.list()
     * .then(({ collections, count, limit, offset }) => {
     *   console.log(collections)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.collection.list({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ collections, count, limit, offset }) => {
     *   console.log(collections)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each collection:
     * 
     * ```ts
     * sdk.store.collection.list({
     *   fields: "id,handle"
     * })
     * .then(({ collections, count, limit, offset }) => {
     *   console.log(collections)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    list: async (
      query?: FindParams & HttpTypes.StoreCollectionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCollectionListResponse
      >(`/store/collections`, {
        query,
        headers,
      })
    },
    /**
     * This method retrieves a collection by its ID. It sends a request to the [Get Collection](https://docs.medusajs.com/api/store#collections_getcollectionsid)
     * API route.
     * 
     * Related guide: [How to retrieve a collection in a storefront](https://docs.medusajs.com/resources/storefront-development/products/collections/retrieve).
     * 
     * @param id - The ID of the collection to retrieve.
     * @param query - Configure the fields to retrieve in the collection.
     * @param headers - Headers to pass in the request
     * @returns The collection.
     * 
     * @example
     * To retrieve a collection by its ID:
     * 
     * ```ts
     * sdk.store.collection.retrieve("pcol_123")
     * .then(({ collection }) => {
     *   console.log(collection)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.collection.retrieve("pcol_123", {
     *   fields: "id,handle"
     * })
     * .then(({ collection }) => {
     *   console.log(collection)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCollectionResponse>(
        `/store/collections/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public category = {
    /**
     * This method retrieves a paginated list of product categories. It sends a request to the 
     * [List Categories](https://docs.medusajs.com/api/store#product-categories_getproductcategories) API route.
     * 
     * Related guide: [How to retrieve list of categories in the storefront](https://docs.medusajs.com/resources/storefront-development/products/categories/list).
     * 
     * @param query - Filters and pagination configurations.
     * @param headers - Headers to pass in the request.
     * @returns The paginated list of categoreis.
     * 
     * @example
     * To retrieve the list of categoreis:
     * 
     * ```ts
     * sdk.store.category.list()
     * .then(({ product_categories, count, offset, limit }) => {
     *   console.log(product_categories)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.category.list({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ product_categories, count, offset, limit }) => {
     *   console.log(product_categories)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each category:
     * 
     * ```ts
     * sdk.store.category.list({
     *   fields: "id,*parent_category"
     * })
     * .then(({ product_categories, count, offset, limit }) => {
     *   console.log(product_categories)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    list: async (
      query?: FindParams & HttpTypes.StoreProductCategoryListParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreProductCategoryListResponse
      >(`/store/product-categories`, {
        query,
        headers,
      })
    },
    /**
     * This method retrieves a category by its ID. It sends a request to the 
     * [Retrieve Product Category](https://docs.medusajs.com/api/store#product-categories_getproductcategoriesid).
     * 
     * Related guide: [How to retrieve a category in the storefront](https://docs.medusajs.com/resources/storefront-development/products/categories/retrieve).
     * 
     * @param id - The ID of the category to retrieve.
     * @param query - Configure the fields to retrieve in the category.
     * @param headers - Headers to pass in the request
     * @returns The category.
     * 
     * @example
     * To retrieve a category by its ID:
     * 
     * ```ts
     * sdk.store.category.retrieve("pcat_123")
     * .then(({ product_category }) => {
     *   console.log(product_category)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.category.retrieve("pcat_123", {
     *   fields: "id,*parent_category"
     * })
     * .then(({ product_category }) => {
     *   console.log(product_category)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: HttpTypes.StoreProductCategoryParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreProductCategoryResponse
      >(`/store/product-categories/${id}`, {
        query,
        headers,
      })
    },
  }

  public product = {
    /**
     * This method retrieves a list of products. It sends a request to the
     * [List Products API route](https://docs.medusajs.com/api/store#products_getproducts).
     * 
     * Related guides:
     * 
     * - [How to list products in a storefront](https://docs.medusajs.com/resources/storefront-development/products/list).
     * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/resources/storefront-development/products/price)
     * 
     * @param query - Filters and pagination configurations.
     * @param headers - Headers to pass in the request.
     * @returns The paginated list of products.
     * 
     * @example
     * To retrieve the list of products:
     * 
     * ```ts
     * sdk.store.product.list()
     * .then(({ products, count, offset, limit }) => {
     *   console.log(products)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.product.list({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ products, count, offset, limit }) => {
     *   console.log(products)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each product:
     * 
     * ```ts
     * sdk.store.product.list({
     *   fields: "id,*collection"
     * })
     * .then(({ products, count, offset, limit }) => {
     *   console.log(products)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    list: async (
      query?: HttpTypes.StoreProductParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreProductListResponse>(
        `/store/products`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method is used to retrieve a product by its ID. It sends a request to the 
     * [Get Product](https://docs.medusajs.com/api/store#products_getproductsid) API route.
     * 
     * Related guides:
     * 
     * - [How to retrieve a product in the storefront](https://docs.medusajs.com/resources/storefront-development/products/retrieve).
     * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/resources/storefront-development/products/price)
     * 
     * @param id - The product's ID.
     * @param query - Configure the fields to retrieve in the product.
     * @param headers - Headers to pass in the request
     * @returns The product.
     * 
     * @example
     * To retrieve a product by its ID:
     * 
     * ```ts
     * sdk.store.product.retrieve("prod_123")
     * .then(({ product }) => {
     *   console.log(product)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.product.retrieve("prod_123", {
     *   fields: "id,*collection"
     * })
     * .then(({ product }) => {
     *   console.log(product)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreProductResponse>(
        `/store/products/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  /**
   * Related guides: [How to implement carts in the storefront](https://docs.medusajs.com/resources/storefront-development/cart).
   */
  public cart = {
    /**
     * This method creates a cart. It sends a request to the [Create Cart](https://docs.medusajs.com/api/store#carts_postcarts)
     * API route.
     * 
     * Related guide: [How to create a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/create).
     * 
     * @param body - The details of the cart to create.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The created cart.
     * 
     * @example
     * sdk.store.cart.create({
     *   region_id: "reg_123"
     * })
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     */
    create: async (
      body: HttpTypes.StoreCreateCart,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(`/store/carts`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    /**
     * This method updates a cart. It sends a request to the
     * [Update Cart](https://docs.medusajs.com/api/store#carts_postcartsid) API route.
     * 
     * Related guide: [How to update a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/update).
     * 
     * @param id - The cart's ID.
     * @param body - The data to update in the cart.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The updated cart.
     * 
     * @example
     * sdk.store.cart.update("cart_123", {
     *   region_id: "reg_123"
     * })
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     */
    update: async (
      id: string,
      body: HttpTypes.StoreUpdateCart,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(
        `/store/carts/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method retrieves a cart by its ID. It sends a request to the 
     * [Get Cart](https://docs.medusajs.com/api/store#carts_getcartsid) API route.
     * 
     * Related guide: [How to retrieve a cart in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/retrieve).
     * 
     * @param id - The cart's ID.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The cart's details.
     * 
     * @example
     * To retrieve a cart by its ID:
     * 
     * ```ts
     * sdk.store.cart.retrieve("cart_123")
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.cart.retrieve("cart_123", {
     *   fields: "id,*items"
     * })
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(
        `/store/carts/${id}`,
        {
          headers,
          query,
        }
      )
    },
    /**
     * This methods adds a product variant to the cart as a line item. It sends a request to the
     * [Add Line Item](https://docs.medusajs.com/api/store#carts_postcartsidlineitems) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
     * 
     * @param cartId - The cart's ID.
     * @param body - The details of the item to add.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The cart's details.
     * 
     * @example
     * sdk.store.cart.createLineItem("cart_123", {
     *   variant_id: "variant_123",
     *   quantity: 1
     * })
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     */
    createLineItem: async (
      cartId: string,
      body: HttpTypes.StoreAddCartLineItem,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(
        `/store/carts/${cartId}/line-items`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method updates a line item in a cart. It sends a request to the 
     * [Update Line Item](https://docs.medusajs.com/api/store#carts_postcartsidlineitemsline_id) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
     * 
     * @param cartId - The cart's ID.
     * @param lineItemId - The line item's ID.
     * @param body - The data to update.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The cart's details.
     * 
     * @example
     * sdk.store.cart.updateLineItem(
     *   "cart_123", 
     *   "li_123",
     *   {
     *     quantity: 1
     *   }
     * )
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     */
    updateLineItem: async (
      cartId: string,
      lineItemId: string,
      body: HttpTypes.StoreUpdateCartLineItem,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method deletes a line item from a cart. It sends a request to the
     * [Remove Line Item](https://docs.medusajs.com/api/store#carts_deletecartsidlineitemsline_id) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/resources/storefront-development/cart/manage-items).
     * 
     * @param cartId - The cart's ID.
     * @param lineItemId - The item's ID.
     * @param headers - Headers to pass in the request.
     * @returns The deletion's details.
     * 
     * @example
     * sdk.store.cart.deleteLineItem(
     *   "cart_123",
     *   "li_123"
     * )
     * .then(({ deleted, parent: cart }) => {
     *   console.log(deleted, cart)
     * })
     */
    deleteLineItem: async (
      cartId: string,
      lineItemId: string,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreLineItemDeleteResponse>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
    /**
     * This method adds a shipping method to a cart. It sends a request to 
     * the [Add Shipping Method](https://docs.medusajs.com/api/store#carts_postcartsidshippingmethods) API routes.
     * 
     * Related guide: [Implement shipping step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/shipping).
     * 
     * @param cartId - The cart's ID.
     * @param body - The shipping method's details.
     * @param query - Configure the fields to retrieve in the cart.
     * @param headers - Headers to pass in the request.
     * @returns The cart's details.
     * 
     * @example
     * sdk.store.cart.addShippingMethod("cart_123", {
     *   option_id: "so_123",
     *   data: {
     *     // custom data for fulfillment provider.
     *   }
     * })
     * .then(({ cart }) => {
     *   console.log(cart)
     * })
     */
    addShippingMethod: async (
      cartId: string,
      body: HttpTypes.StoreAddCartShippingMethods,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<HttpTypes.StoreCartResponse>(
        `/store/carts/${cartId}/shipping-methods`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method completes a cart and places the order. It's the last step of the checkout flow.
     * The method sends a request to the [Complete Cart](https://docs.medusajs.com/api/store#carts_postcartsidcomplete)
     * API route.
     * 
     * Related guide: [Learn how to complete cart in checkout flow](https://docs.medusajs.com/resources/storefront-development/checkout/complete-cart).
     * 
     * @param cartId - The cart's ID.
     * @param query - Configure the fields to retrieve in the created order.
     * @param headers - Headers to pass in the request.
     * @returns The order's details, if it was placed successfully. Otherwise, the cart is returned with an error.
     * 
     * @example
     * sdk.store.cart.complete("cart_123")
     * .then((data) => {
     *   if(data.type === "cart") {
     *     // an error occurred
     *     console.log(data.error, data.cart)
     *   } else {
     *     // order placed successfully
     *     console.log(data.order)
     *   }
     * })
     */
    complete: async (
      cartId: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCompleteCartResponse
      >(`/store/carts/${cartId}/complete`, {
        method: "POST",
        headers,
        query,
      })
    },
  }

  public fulfillment = {
    /**
     * This method retrieves the list of shipping options for a cart. It sends a request to
     * the [List Shipping Options](https://docs.medusajs.com/api/store#shipping-options_getshippingoptions)
     * API route.
     * 
     * Related guide: [Implement shipping step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/shipping).
     * 
     * @param query - The cart's details along with configurations of the fields to retrieve in the options.
     * @param headers - Headers to pass in the request.
     * @returns The shipping options that can be used for the cart.
     * 
     * @example
     * sdk.store.fulfillment.listCartOptions({
     *   cart_id: "cart_123"
     * })
     * .then(({ shipping_options }) => {
     *   console.log(shipping_options)
     * })
     */
    listCartOptions: async (
      query?: HttpTypes.StoreGetShippingOptionList,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreShippingOptionListResponse
      >(`/store/shipping-options`, {
        headers,
        query,
      })
    },
  }

  public payment = {
    /**
     * This method retrieves the payment providers available in a region, which is useful during checkout.
     * It sends a request to the [List Payment Providers](https://docs.medusajs.com/api/store#payment-providers_getpaymentproviders)
     * API route.
     * 
     * Related guide: [Implement payment step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/payment).
     * 
     * @param query - The filters to apply on the retrieved providers, along with configurations of the 
     * fields to retrieve in the options.
     * @param headers - Headers to pass in the request.
     * @returns The list of payment providers.
     * 
     * @example
     * To retrieve the list of payment providers for a region:
     * 
     * ```ts
     * sdk.store.payment.listPaymentProviders({
     *   region_id: "reg_123"
     * })
     * .then(({ payment_providers, count, offset, limit }) => {
     *   console.log(payment_providers)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.payment.listPaymentProviders({
     *   region_id: "reg_123",
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ payment_providers, count, offset, limit }) => {
     *   console.log(payment_providers)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each provider:
     * 
     * ```ts
     * sdk.store.payment.listPaymentProviders({
     *   region_id: "reg_123",
     *   limit: 10,
     *   offset: 10,
     *   fields: "id"
     * })
     * .then(({ payment_providers, count, offset, limit }) => {
     *   console.log(payment_providers)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    listPaymentProviders: async (
      query?: FindParams & HttpTypes.StorePaymentProviderFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StorePaymentProviderListResponse
      >(`/store/payment-providers`, {
        headers,
        query,
      })
    },

    /**
     * This method creates a payment session of a cart's payment collection, selecting a payment provider.
     * It sends a request to the [Initialize Payment Session](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollectionsidpaymentsessions)
     * API route.
     * 
     * If the cart doesn't have a payment collection, a payment collection is created for the cart by
     * sending a request to the [Create Payment Collection](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollections)
     * API route.
     * 
     * Related guide: [Implement payment step during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/payment).
     * 
     * @param cart - The cart's details.
     * @param body - The payment session's details.
     * @param query - Configure the fields to retrieve in the payment collection.
     * @param headers - Headers to pass in the request.
     * @returns The payment collection's details.
     * 
     * @example
     * sdk.store.payment.initiatePaymentSession(
     *   cart, // assuming you already have the cart object.
     *   {
     *     provider_id: "pp_stripe_stripe",
     *     data: {
     *       // any data relevant for the provider.
     *     }
     *   }
     * )
     * .then(({ payment_collection }) => {
     *   console.log(payment_collection)
     * })
     */
    initiatePaymentSession: async (
      cart: HttpTypes.StoreCart,
      body: HttpTypes.StoreInitializePaymentSession,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      let paymentCollectionId = (cart as any).payment_collection?.id
      if (!paymentCollectionId) {
        const collectionBody = {
          cart_id: cart.id,
        }
        paymentCollectionId = (
          await this.client.fetch<
            HttpTypes.StorePaymentCollectionResponse
          >(`/store/payment-collections`, {
            method: "POST",
            headers,
            body: collectionBody,
          })
        ).payment_collection.id
      }

      return this.client.fetch<
        HttpTypes.StorePaymentCollectionResponse
      >(`/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
  }

  public order = {
    /**
     * This method retrieves a paginated list of orders matching the specified filters. It
     * sends a request to the [List Orders](https://docs.medusajs.com/api/store#orders_getorders)
     * API route.
     * 
     * @param query - Configure the fields to retrieve in the orders.
     * @param headers - Headers to pass in the request.
     * @returns The paginated list of orders.
     * 
     * @example
     * To retrieve the list of orders:
     * 
     * ```ts
     * sdk.store.order.list()
     * .then(({ orders, count, offset, limit }) => {
     *   console.log(orders)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.order.list({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ orders, count, offset, limit }) => {
     *   console.log(orders)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each order:
     * 
     * ```ts
     * sdk.store.order.list({
     *   fields: "id,*items"
     * })
     * .then(({ orders, count, offset, limit }) => {
     *   console.log(orders)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    list: async (
      query?: HttpTypes.StoreOrderFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreOrderListResponse
      >(`/store/orders`, {
        query,
        headers,
      })
    },
    /**
     * This method retrieves an order by its ID. It sends a request to the 
     * [Get Order](https://docs.medusajs.com/api/store#orders_getordersid) API route.
     * 
     * @param id - The order's ID.
     * @param query - Configure the fields to retrieve in the order.
     * @param headers - Headers to pass in the request.
     * @returns The order's details.
     * 
     * @example
     * To retrieve an order by its ID:
     * 
     * ```ts
     * sdk.store.order.retrieve("order_123")
     * .then(({ order }) => {
     *   console.log(order)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.order.retrieve("order_123", {
     *   fields: "id,*items"
     * })
     * .then(({ order }) => {
     *   console.log(order)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ order: HttpTypes.StoreOrder }>(
        `/store/orders/${id}`,
        {
          headers,
          query,
        }
      )
    },
  }

  public customer = {
    /**
     * This method registers a customer. It sends a request to the [Register Customer](https://docs.medusajs.com/api/store#customers_postcustomers)
     * API route.
     * 
     * You must use the {@link Auth.register} method first to retrieve a registration token. Then, pass that
     * registration token in the `headers` parameter of this method as an authorization bearer header. 
     * 
     * Related guide: [How to register customer in storefront](https://docs.medusajs.com/resources/storefront-development/customers/register)
     * 
     * @param body - The customer's details.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request. This is where you include the authorization JWT registration token.
     * @returns The customer's details.
     * 
     * @example
     * const token = await sdk.auth.register("customer", "emailpass", {
     *   "email": "customer@gmail.com",
     *   "password": "supersecret"
     * })
     * 
     * sdk.store.customer.create(
     *   {
     *     "email": "customer@gmail.com"
     *   },
     *   {},
     *   {
     *     Authorization: `Bearer ${token}`
     *   }
     * )
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    create: async (
      body: HttpTypes.StoreCreateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerResponse
      >(`/store/customers`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    /**
     * This method updates the logged-in customer's details. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the
     * [Update Customer](https://docs.medusajs.com/api/store#customers_postcustomersme) API route.
     * 
     * Related guide: [How to edit customer's profile in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/profile).
     * 
     * @param body - The customer's details to update.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     * 
     * @example
     * sdk.store.customer.update({
     *   first_name: "John"
     * })
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    update: async (
      body: HttpTypes.StoreUpdateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerResponse
      >(
        `/store/customers/me`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method retrieves the logged-in customer's details. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [Get Logged-In Customer](https://docs.medusajs.com/api/store#customers_getcustomersme)
     * API route.
     * 
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     * 
     * @example
     * sdk.store.customer.retrieve()
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    retrieve: async (query?: SelectParams, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.StoreCustomerResponse>(
        `/store/customers/me`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method creates an address for the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [Create Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddresses)
     * API route.
     * 
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     * 
     * @param body - The address's details.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     * 
     * @example
     * sdk.store.customer.createAddress({
     *   country_code: "us"
     * })
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    createAddress: async (
      body: HttpTypes.StoreCreateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerResponse
      >(`/store/customers/me/addresses`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    /**
     * This method updates the address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [Update Address](https://docs.medusajs.com/api/store#customers_postcustomersmeaddressesaddress_id)
     * API route.
     * 
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     * 
     * @param addressId - The ID of the address to update.
     * @param body - The details to update in the address.
     * @param query - Configure the fields to retrieve in the customer.
     * @param headers - Headers to pass in the request.
     * @returns The customer's details.
     * 
     * @example
     * sdk.store.customer.updateAddress(
     *   "caddr_123",
     *   {
     *     country_code: "us"
     *   }
     * )
     * .then(({ customer }) => {
     *   console.log(customer)
     * })
     */
    updateAddress: async (
      addressId: string,
      body: HttpTypes.StoreUpdateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerResponse
      >(
        `/store/customers/me/addresses/${addressId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    /**
     * This method retrieves the logged-in customer's address. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [List Customer's Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddresses)
     * API route.
     * 
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     * 
     * @param query - Configure the fields to retrieve in the addresses.
     * @param headers - Headers to pass in the request.
     * @returns The paginated list of addresses.
     * 
     * @example
     * To retrieve the list of addresses:
     * 
     * ```ts
     * sdk.store.customer.listAddress()
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     * 
     * To configure the pagination, pass the `limit` and `offset` query parameters.
     * 
     * For example, to retrieve only 10 items and skip 10 items:
     * 
     * ```ts
     * sdk.store.customer.listAddress({
     *   limit: 10,
     *   offset: 10
     * })
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     * 
     * Using the `fields` query parameter, you can specify the fields and relations to retrieve
     * in each address:
     * 
     * ```ts
     * sdk.store.customer.listAddress({
     *   fields: "id,country_code"
     * })
     * .then(({ addresses, count, offset, limit }) => {
     *   console.log(addresses)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    listAddress: async (
      query?: FindParams & HttpTypes.StoreCustomerAddressFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerAddressListResponse
      >(`/store/customers/me/addresses`, {
        query,
        headers,
      })
    },
    /**
     * This method retrieves an address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [Get Address](https://docs.medusajs.com/api/store#customers_getcustomersmeaddressesaddress_id)
     * API route.
     * 
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     * 
     * @param addressId - The address's ID.
     * @param query - Configure the fields to retrieve in the address.
     * @param headers - Headers to pass in the request.
     * @returns The address's details.
     * 
     * @example
     * To retrieve an address by its ID:
     * 
     * ```ts
     * sdk.store.customer.retrieveAddress(
     *   "caddr_123"
     * )
     * .then(({ address }) => {
     *   console.log(address)
     * })
     * ```
     * 
     * To specify the fields and relations to retrieve:
     * 
     * ```ts
     * sdk.store.customer.retrieveAddress(
     *   "caddr_123",
     *   {
     *     fields: "id,country_code"
     *   }
     * )
     * .then(({ address }) => {
     *   console.log(address)
     * })
     * ```
     * 
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/store#select-fields-and-relations).
     */
    retrieveAddress: async (
      addressId: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        HttpTypes.StoreCustomerAddressResponse
      >(
        `/store/customers/me/addresses/${addressId}`,
        {
          query,
          headers,
        }
      )
    },
    /**
     * This method deletes an address of the logged-in customer. The customer must be logged in
     * first with the {@link Auth.login} method.
     * 
     * It sends a request to the [Remove Address](https://docs.medusajs.com/api/store#customers_deletecustomersmeaddressesaddress_id)
     * API route.
     * 
     * Related guides: [How to manage customer's addresses in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/addresses)
     * 
     * @param addressId - The address's ID.
     * @param headers - Headers to pass in the request.
     * @returns The deletion's details.
     * 
     * @example
     * sdk.store.customer.deleteAddress("caddr_123")
     * .then(({ deleted, parent: customer }) => {
     *   console.log(customer)
     * })
     */
    deleteAddress: async (addressId: string, headers?: ClientHeaders) => {
      return this.client.fetch<HttpTypes.StoreCustomerAddressDeleteResponse>(
        `/store/customers/me/addresses/${addressId}`,
        {
          method: "DELETE",
          headers,
        }
      )
    },
  }
}
