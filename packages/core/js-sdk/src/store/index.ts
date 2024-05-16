import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Store {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  public region = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/regions`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/regions/${id}`, {
        query: queryParams,
        headers,
      })
    },
  }

  public collection = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/collections`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/collections/${id}`, {
        query: queryParams,
        headers,
      })
    },
  }

  public category = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/product-categories`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/product-categories/${id}`, {
        query: queryParams,
        headers,
      })
    },
  }

  public product = {
    list: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/products`, {
        query: queryParams,
        headers,
      })
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/products/${id}`, {
        query: queryParams,
        headers,
      })
    },
  }

  public order = {
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/orders/${id}`, {
        query: queryParams,
        headers,
      })
    },
  }

  public cart = {
    create: async (body: any, headers?: ClientHeaders) => {
      return this.client.fetch<any>(`/store/carts`, {
        headers,
        method: "POST",
        body,
      })
    },
    update: async (id: string, body: any, headers?: ClientHeaders) => {
      return this.client.fetch<any>(`/store/carts/${id}`, {
        headers,
        method: "POST",
        body,
      })
    },
    retrieve: async (
      id: string,
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/carts/${id}`, {
        query: queryParams,
        headers,
      })
    },
    createLineItem: async (
      cartId: string,
      body: any,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/carts/${cartId}/line-items`, {
        headers,
        method: "POST",
        body,
      })
    },
    updateLineItem: async (
      cartId: string,
      lineItemId: string,
      body: any,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        {
          headers,
          method: "POST",
          body,
        }
      )
    },
    deleteLineItem: async (
      cartId: string,
      lineItemId: string,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        {
          headers,
          method: "DELETE",
        }
      )
    },
    addShippingMethod: async (
      cartId: string,
      body: any,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/carts/${cartId}/shipping-methods`, {
        headers,
        method: "POST",
        body,
      })
    },
    complete: async (cartId: string, headers?: ClientHeaders) => {
      return this.client.fetch<any>(`/store/carts/${cartId}/complete`, {
        headers,
        method: "POST",
      })
    },
  }

  public fulfillment = {
    listCartOptions: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/shipping-options`, {
        query: queryParams,
        headers,
      })
    },
  }

  public payment = {
    listPaymentProviders: async (
      queryParams?: Record<string, any>,
      headers?: ClientHeaders
    ) => {
      return this.client.fetch<any>(`/store/payment-providers`, {
        query: queryParams,
        headers,
      })
    },

    initiatePaymentSession: async (
      cart: any,
      body: Record<string, any>,
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
          await this.client.fetch<any>(`/store/payment-collections`, {
            headers,
            method: "POST",
            body: collectionBody,
          })
        ).payment_collection.id
      }

      return this.client.fetch<any>(
        `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          headers,
          method: "POST",
          body,
        }
      )
    },
  }
}
