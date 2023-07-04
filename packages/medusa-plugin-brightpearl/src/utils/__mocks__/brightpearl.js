import axios from "axios"
export const mockCreateOrder = jest
  .fn()
  .mockReturnValue(Promise.resolve("1234"))

export const mockCreateCredit = jest
  .fn()
  .mockReturnValue(Promise.resolve("1234"))

const mock = jest.fn().mockImplementation(function (options) {
  this.tokenStore_ = options.token_store
  this.token_ = options.access_token
  this.client = axios.create({
    baseURL: `https://mock.com`,
    headers: {
      "brightpearl-app-ref": "medusa-dev",
      "brightpearl-dev-ref": "sebrindom",
    },
  })

  this.updateAuth = (data) => {
    this.token_ = data.access_token
  }

  this.client.interceptors.request.use(async (request) => {
    const token = await this.tokenStore_.getToken()

    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`
    }

    return request
  })

  this.client.interceptors.response.use(undefined, async (error) => {
    const response = error.response

    if (response) {
      if (
        response.status === 401 &&
        error.config &&
        !error.config.__isRetryRequest
      ) {
        try {
          await this.tokenStore_.refreshToken()
        } catch (authError) {
          // refreshing has failed, but report the original error, i.e. 401
          return Promise.reject(error)
        }

        // retry the original request
        error.config.__isRetryRequest = true
        return this.client(error.config)
      }
    }

    return Promise.reject(error)
  })

  this.test = {
    success: () => this.client.get("/success"),
    fail: () => this.client.get("/fail"),
  }
  this.warehouses = {
    createReservation: jest.fn().mockReturnValue(Promise.resolve()),
  }
  this.payments = {
    create: jest.fn().mockReturnValue(Promise.resolve()),
  }
  this.orders = {
    create: mockCreateOrder,
    createCredit: mockCreateCredit,
    retrieve: jest.fn().mockReturnValue(Promise.resolve()),
  }
  this.products = {
    retrieveBySKU: jest.fn().mockReturnValue(
      Promise.resolve({
        productId: 1234,
      })
    ),
  }
  this.customers = {
    retrieveByEmail: jest.fn().mockReturnValue(
      Promise.resolve([
        {
          primaryEmail: "test@example.com",
          contactId: "12345",
        },
      ])
    ),
  }
  return this
})

export default mock
