import axios from "axios"

class Webshipper {
  constructor({ account, token }) {
    this.account_ = account
    this.token_ = token
    this.client_ = axios.createClient({
      baseURL: `https://${account}.api.webshipper.io/v2`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    this.shippingRates = this.buildShippingRateEndpoints_()
    this.orders = this.buildOrderEndpoints_()
  }

  buildShippingRateEndpoints = () => {
    return {
      list: () => {
        const path = `/shipping_rates`
        return this.client_({
          method: "GET",
          url: path,
        }).then(({ data }) => data)
      },
    }
  }

  buildOrderEndpoints = () => {
    return {
      retrieve: () => {},
    }
  }
}
