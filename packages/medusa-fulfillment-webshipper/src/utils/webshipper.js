import axios from "axios"

class Webshipper {
  constructor({ account, token }) {
    this.account_ = account
    this.token_ = token
    this.client_ = axios.create({
      baseURL: `https://${account}.api.webshipper.io`,
      headers: {
        "content-type": "application/vnd.api+json",
        Authorization: `Bearer ${token}`,
      },
    })

    this.documents = this.buildDocumentEndpoints_()
    this.shippingRates = this.buildShippingRateEndpoints_()
    this.orders = this.buildOrderEndpoints_()
    this.shipments = this.buildShipmentEndpoints_()
  }

  async request(data) {
    return this.client_(data).then(({ data }) => data)
  }

  buildDocumentEndpoints_ = () => {
    return {
      create: async (data) => {
        const path = `/v2/documents`
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

  buildShippingRateEndpoints_ = () => {
    return {
      retrieve: async (id) => {
        const path = `/v2/shipping_rates/${id}`
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
      list: async (params = {}) => {
        let path = `/v2/shipping_rates`

        if (Object.entries(params).length) {
          const search = Object.entries(params).map(([key, value]) => {
            return `filter[${key}]=${value}`
          })
          path += `?${search.join("&")}`
        }

        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
    }
  }

  buildOrderEndpoints_ = () => {
    return {
      retrieve: async (id) => {
        const path = `/v2/orders/${id}`
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
      create: async (data) => {
        const path = `/v2/orders`
        return this.client_({
          method: "POST",
          url: path,
          data: {
            data,
          },
        }).then(({ data }) => data)
      },
      update: async (id, data) => {
        const path = `/v2/orders/${id}`
        return this.client_({
          method: "PATCH",
          url: path,
          data: {
            data,
          },
        }).then(({ data }) => data)
      },
      delete: async (id) => {
        const path = `/v2/orders/${id}`
        return this.client_({
          method: "DELETE",
          url: path,
        }).then(({ data }) => data)
      },
    }
  }

  buildShipmentEndpoints_ = () => {
    return {
      retrieve: async (id) => {
        const path = `/v2/shipments/${id}`
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
      create: async (data) => {
        const path = `/v2/shipments`
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

export default Webshipper
