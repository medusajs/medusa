import {
  FindParams,
  HttpTypes,
  PaginatedResponse,
  SelectParams,
  DeleteResponse,
} from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Store {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  public region = {
    list: async (
      query?: FindParams & HttpTypes.StoreRegionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ regions: HttpTypes.StoreRegion[] }>
      >(`/store/regions`, {
        query,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ region: HttpTypes.StoreRegion }>(
        `/store/regions/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public collection = {
    list: async (
      query?: FindParams & HttpTypes.StoreCollectionFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ collections: HttpTypes.StoreCollection }>
      >(`/store/collections`, {
        query,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ collection: HttpTypes.StoreCollection }>(
        `/store/collections/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public category = {
    list: async (
      query?: FindParams & HttpTypes.StoreProductCategoryFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ categories: HttpTypes.StoreProductCategory }>
      >(`/store/product-categories`, {
        query,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ category: HttpTypes.StoreProductCategory }>(
        `/store/product-categories/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public product = {
    list: async (
      query?: FindParams & HttpTypes.StoreProductFilters,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        PaginatedResponse<{ products: HttpTypes.StoreProduct }>
      >(`/store/products`, {
        query,
        headers,
      })
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ product: HttpTypes.StoreProduct }>(
        `/store/products/${id}`,
        {
          query,
          headers,
        }
      )
    },
  }

  public cart = {
    create: async (
      body: HttpTypes.StoreCreateCart,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(`/store/carts`, {
        method: "POST",
        headers,
        body,
        query,
      })
    },
    update: async (
      id: string,
      body: HttpTypes.StoreUpdateCart,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${id}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    retrieve: async (
      id: string,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${id}`,
        {
          headers,
          query,
        }
      )
    },
    createLineItem: async (
      cartId: string,
      body: HttpTypes.StoreAddCartLineItem,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${cartId}/line-items`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    updateLineItem: async (
      cartId: string,
      lineItemId: string,
      body: HttpTypes.StoreUpdateCartLineItem,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        {
          method: "POST",
          headers,
          body,
          query,
        }
      )
    },
    deleteLineItem: async (
      cartId: string,
      lineItemId: string,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<
        DeleteResponse<"line-item", HttpTypes.StoreCart>
      >(`/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: "DELETE",
        headers,
      })
    },
    addShippingMethod: async (
      cartId: string,
      body: HttpTypes.StoreAddCartShippingMethods,
      query?: SelectParams,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<{ cart: HttpTypes.StoreCart }>(
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
    listCartOptions: async (query?: FindParams, headers?: ClientHeaders) => {
      return this.client.fetch<any>(`/store/shipping-options`, {
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
          region_id: cart.region_id,
          currency_code: cart.currency_code,
          amount: cart.total,
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
}
