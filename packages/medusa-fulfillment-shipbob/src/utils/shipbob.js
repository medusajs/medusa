import axios from "axios"

class Shipbob {
  constructor({ account, token, channelId }) {
    this.account_ = account
    this.token_ = token
    this.client_ = axios.create({
      baseURL: 'https://api.shipbob.com',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        shipbob_channel_id: channelId,
      },
    })

    this.shippingMethods = this.buildShippingMethodEndpoints_()
    this.orders = this.buildOrderEndpoints_()
    this.returns = this.buildReturnEndpoints_()
  }

  async request(data) {
    return this.client_(data).then(({ data }) => data)
  }

  buildShippingMethodEndpoints_ = () => {
    return {
      list: async () => {
        const path = '/1.0/shippingmethod'
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
    }
  }

  buildOrderEndpoints_ = () => {
    return {
      retrieve: async (orderId) => {
        const path = `/1.0/order/${orderId}`
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
      create: async (data) => {
        const path = '/1.0/order'
        return this.client_({
          method: "POST",
          url: path,
          data: {
            data,
          },
        }).then(({ data }) => data)
      },
      cancel: async (orderId) => {
        const path = `/1.0/order/${orderId}/cancel`
        return this.client_({
          method: "POST",
          url: path,
        }).then(({ data }) => data)
      },
    }
  }

  buildReturnEndpoints_ = () => {
    return {
      create: async (data) => {
        const path = '/1.0/return'
        return this.client_({
          method: "POST",
          url: path,
          data: {
            data,
          },
        }).then(({ data }) => data)
      },
    }
  }
}

export default Shipbob
