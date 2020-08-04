import axios from "axios"
import qs from "querystring"

class BrightpearlClient {
  static createToken(account, data) {
    const params = {
      grant_type: "authorization_code",
      code: data.code,
      client_id: data.client_id,
      client_secret: data.client_secret,
      redirect_uri: data.redirect,
    }

    return axios({
      url: `https://ws-eu1.brightpearl.com/${account}/oauth/token`,
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(params),
    }).then(({ data }) => data)
  }

  constructor(options) {
    this.client_ = axios.create({
      baseURL: `${options.url}/public-api/${options.account}`,
      headers: {
        "brightpearl-app-ref": "medusa-dev",
        "brightpearl-dev-ref": "sebrindom",
        Authorization: `${options.auth_type} ${options.access_token}`,
      },
    })

    this.webhooks = this.buildWebhookEndpoints()
    this.payments = this.buildPaymentEndpoints()
    this.warehouses = this.buildWarehouseEndpoints()
    this.orders = this.buildOrderEndpoints()
    this.addresses = this.buildAddressEndpoints()
    this.customers = this.buildCustomerEndpoints()
    this.products = this.buildProductEndpoints()
  }

  buildSearchResults_(response) {
    const { results, metaData } = response
    // Map the column names to the columns
    return results.map((resColumns) => {
      const object = {}
      for (let i = 0; i < resColumns.length; i++) {
        const fieldName = metaData.columns[i].name
        object[fieldName] = resColumns[i]
      }
      return object
    })
  }

  buildWebhookEndpoints = () => {
    return {
      list: () => {
        return this.client_
          .request({
            url: `/integration-service/webhook`,
            method: "GET",
          })
          .then(({ data }) => data.response)
      },
      create: (data) => {
        return this.client_.request({
          url: `/integration-service/webhook`,
          method: "POST",
          data,
        })
      },
    }
  }

  buildPaymentEndpoints = () => {
    return {
      create: (payment) => {
        return this.client_
          .request({
            url: `/accounting-service/customer-payment`,
            method: "POST",
            data: payment,
          })
          .then(({ data }) => data.response)
      },
    }
  }

  buildWarehouseEndpoints = () => {
    return {
      retrieveReservation: (orderId) => {
        return this.client_
          .request({
            url: `/warehouse-service/order/${orderId}/reservation`,
            method: "GET",
          })
          .then(({ data }) => data.response)
      },
      createGoodsOutNote: (orderId, data) => {
        return this.client_
          .request({
            url: `/warehouse-service/order/${orderId}/goods-note/goods-out`,
            method: "POST",
            data,
          })
          .then(({ data }) => data.response)
      },
      updateGoodsOutNote: (noteId, update) => {
        return this.client_.request({
          url: `/warehouse-service/goods-note/goods-out/${noteId}`,
          method: "PUT",
          data: update,
        })
      },
      registerGoodsOutEvent: (noteId, data) => {
        return this.client_.request({
          url: `/warehouse-service/goods-note/goods-out/${noteId}/event`,
          method: "POST",
          data,
        })
      },
      createReservation: (order, warehouse) => {
        const id = order.id
        const data = order.rows.map((r) => ({
          productId: r.productId,
          salesOrderRowId: r.id,
          quantity: r.quantity,
        }))
        return this.client_
          .request({
            url: `/warehouse-service/order/${id}/reservation/warehouse/${warehouse}`,
            method: "POST",
            data: {
              products: data,
            },
          })
          .then(({ data }) => data.response)
      },
    }
  }

  buildOrderEndpoints = () => {
    return {
      retrieve: (orderId) => {
        return this.client_
          .request({
            url: `/order-service/sales-order/${orderId}`,
            method: "GET",
          })
          .then(({ data }) => data.response.length && data.response[0])
          .catch((err) => console.log(err))
      },
      create: (order) => {
        return this.client_
          .request({
            url: `/order-service/sales-order`,
            method: "POST",
            data: order,
          })
          .then(({ data }) => data.response)
      },
    }
  }

  buildAddressEndpoints = () => {
    return {
      create: (address) => {
        return this.client_
          .request({
            url: `/contact-service/postal-address`,
            method: "POST",
            data: address,
          })
          .then(({ data }) => data.response)
      },
    }
  }

  buildProductEndpoints = () => {
    return {
      retrieveAvailability: (productId) => {
        return this.client_
          .request({
            url: `/warehouse-service/product-availability/${productId}`,
          })
          .then(({ data }) => data.response && data.response)
      },
      retrieve: (productId) => {
        return this.client_
          .request({
            url: `/product-service/product/${productId}`,
          })
          .then(({ data }) => data.response && data.response[0])
      },
      retrieveBySKU: (sku) => {
        return this.client_
          .request({
            url: `/product-service/product-search?SKU=${sku}`,
          })
          .then(({ data }) => {
            return this.buildSearchResults_(data.response)
          })
      },
    }
  }

  buildCustomerEndpoints = () => {
    return {
      retrieveByEmail: (email) => {
        return this.client_
          .request({
            url: `/contact-service/contact-search?primaryEmail=${email}`,
          })
          .then(({ data }) => {
            return this.buildSearchResults_(data.response)
          })
      },

      create: (customerData) => {
        return this.client_
          .request({
            url: `/contact-service/contact`,
            method: "POST",
            data: customerData,
          })
          .then(({ data }) => data.response)
      },
    }
  }
}

export default BrightpearlClient
