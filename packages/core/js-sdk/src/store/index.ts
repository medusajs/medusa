import {
  FindParams,
  HttpTypes,
  PaginatedResponse,
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
     * [List Regions API route](https://docs.medusajs.com/v2/api/store#regions_getregions).
     * 
     * Related guide: [How to list regions in a storefront](https://docs.medusajs.com/v2/resources/storefront-development/regions/list).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * This method retrieves a region by its ID. It sends a request to the [Get Region](https://docs.medusajs.com/v2/api/store#regions_getregionsid)
     * API route.
     * 
     * Related guide: [Store and retrieve regions in a storefront](https://docs.medusajs.com/v2/resources/storefront-development/regions/store-retrieve-region).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [List Collections](https://docs.medusajs.com/v2/api/store#collections_getcollections) API route.
     * 
     * Related guide: [How to retrieve collections in a storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/collections/list).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * This method retrieves a collection by its ID. It sends a request to the [Get Collection](https://docs.medusajs.com/v2/api/store#collections_getcollectionsid)
     * API route.
     * 
     * Related guide: [How to retrieve a collection in a storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/collections/retrieve).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [List Categories](https://docs.medusajs.com/v2/api/store#product-categories_getproductcategories) API route.
     * 
     * Related guide: [How to retrieve list of categories in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/categories/list).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [Retrieve Product Category](https://docs.medusajs.com/v2/api/store#product-categories_getproductcategoriesid).
     * 
     * Related guide: [How to retrieve a category in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/categories/retrieve).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [List Products API route](https://docs.medusajs.com/v2/api/store#products_getproducts).
     * 
     * Related guides:
     * 
     * - [How to list products in a storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/list).
     * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/price)
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [Get Product](https://docs.medusajs.com/v2/api/store#products_getproductsid) API route.
     * 
     * Related guides:
     * 
     * - [How to retrieve a product in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/retrieve).
     * - [How to retrieve a product variant's prices in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/products/price)
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
   * Related guides: [How to implement carts in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart).
   */
  public cart = {
    /**
     * This method creates a cart. It sends a request to the [Create Cart](https://docs.medusajs.com/v2/api/store#carts_postcarts)
     * API route.
     * 
     * Related guide: [How to create a cart in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/create).
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
     * [Update Cart](https://docs.medusajs.com/v2/api/store#carts_postcartsid) API route.
     * 
     * Related guide: [How to update a cart in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/update).
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
     * [Get Cart](https://docs.medusajs.com/v2/api/store#carts_getcartsid) API route.
     * 
     * Related guide: [How to retrieve a cart in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/retrieve).
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
     * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/v2/api/store#select-fields-and-relations).
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
     * [Add Line Item](https://docs.medusajs.com/v2/api/store#carts_postcartsidlineitems) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/manage-items).
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
     * [Update Line Item](https://docs.medusajs.com/v2/api/store#carts_postcartsidlineitemsline_id) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/manage-items).
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
     * [Remove Line Item](https://docs.medusajs.com/v2/api/store#carts_deletecartsidlineitemsline_id) API route.
     * 
     * Related guide: [How to manage a cart's line items in the storefront](https://docs.medusajs.com/v2/resources/storefront-development/cart/manage-items).
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
     * the [Add Shipping Method](https://docs.medusajs.com/v2/api/store#carts_postcartsidshippingmethods) API routes.
     * 
     * Related guide: [Implement shipping step during checkout](https://docs.medusajs.com/v2/resources/storefront-development/checkout/shipping).
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
    complete: async (
      cartId: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        | { type: "order"; order: HttpTypes.StoreOrder }
        | {
            type: "cart"
            cart: HttpTypes.StoreCart
            error: {
              message: string
              name: string
              type: string
            }
          }
      >(`/store/carts/${cartId}/complete`, {
        method: "POST",
        headers,
        query,
      })
    },
  }

  public fulfillment = {
    listCartOptions: async (
      query?: FindParams & { cart_id: string },
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        shipping_options: HttpTypes.StoreCartShippingOption[]
      }>(`/store/shipping-options`, {
        headers,
        query,
      })
    },
  }

  public payment = {
    listPaymentProviders: async (
      query?: FindParams & HttpTypes.StorePaymentProviderFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        payment_providers: HttpTypes.StorePaymentProvider[]
      }>(`/store/payment-providers`, {
        headers,
        query,
      })
    },

    initiatePaymentSession: async (
      cart: HttpTypes.StoreCart,
      body: Record<string, any>,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      let paymentCollectionId = (cart as any).payment_collection?.id
      if (!paymentCollectionId) {
        const collectionBody = {
          cart_id: cart.id,
        }
        paymentCollectionId = (
          await this.client.fetch<{
            payment_collection: HttpTypes.StorePaymentCollection
          }>(`/store/payment-collections`, {
            method: "POST",
            headers,
            body: collectionBody,
          })
        ).payment_collection.id
      }

      return this.client.fetch<{
        payment_collection: HttpTypes.StorePaymentCollection
      }>(`/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
  }

  public order = {
    list: async (
      query?: FindParams & HttpTypes.StoreOrderFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ orders: HttpTypes.StoreOrder[] }>
      >(`/store/orders`, {
        query,
        headers,
      })
    },
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
    create: async (
      body: HttpTypes.StoreCreateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        customer: HttpTypes.StoreCustomer
      }>(`/store/customers`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    update: async (
      body: HttpTypes.StoreUpdateCustomer,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ customer: HttpTypes.StoreCustomer }>(
        `/store/customers/me`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    retrieve: async (query?: SelectParams, headers?: ClientHeaders) => {
      return this.client.fetch<{ customer: HttpTypes.StoreCustomer }>(
        `/store/customers/me`,
        {
          query,
          headers,
        }
      )
    },
    createAddress: async (
      body: HttpTypes.StoreCreateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{
        customer: HttpTypes.StoreCustomer
      }>(`/store/customers/me/addresses`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    updateAddress: async (
      addressId: string,
      body: HttpTypes.StoreUpdateCustomerAddress,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ customer: HttpTypes.StoreCustomer }>(
        `/store/customers/me/addresses/${addressId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    listAddress: async (
      query?: FindParams & HttpTypes.StoreCustomerAddressFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ addresses: HttpTypes.StoreCustomerAddress[] }>
      >(`/store/customers/me/addresses`, {
        query,
        headers,
      })
    },
    retrieveAddress: async (
      addressId: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ address: HttpTypes.StoreCustomerAddress }>(
        `/store/customers/me/addresses/${addressId}`,
        {
          query,
          headers,
        }
      )
    },
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
