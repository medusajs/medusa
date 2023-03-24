import axios from "axios"
import { PaypalHttpClient } from "../paypal-http-client"
import { PaypalApiPath, PaypalSdkOptions } from "../types"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

const accessToken = "accessToken"

const responseData = { test: "test" }

const options: PaypalSdkOptions = {
  clientId: "fake",
  clientSecret: "fake",
  logger: {
    error: jest.fn(),
  } as any,
  useSandbox: true,
}

describe("PaypalHttpClient", function () {
  let paypalHttpClient: PaypalHttpClient

  beforeAll(() => {
    mockedAxios.create.mockReturnThis()
    paypalHttpClient = new PaypalHttpClient(options)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should succeed", async () => {
    mockedAxios.request.mockResolvedValue(Promise.resolve("resolve"))

    const argument = { url: PaypalApiPath.CREATE_ORDER }
    await paypalHttpClient.request(argument)

    expect(mockedAxios.request).toHaveBeenCalledTimes(1)

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: argument.url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer undefined`,
        },
      })
    )
  })

  it("should fail and retry after authentication", async () => {
    mockedAxios.request.mockImplementation((async (config, shouldRetry) => {
      if (config.url === PaypalApiPath.AUTH) {
        return {
          data: {
            access_token: accessToken,
          },
        }
      }

      if (!(shouldRetry === false)) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ response: { status: 401 } })
      }

      return { status: 200, data: responseData }
    }) as any)

    const argument = { url: PaypalApiPath.CREATE_ORDER }
    await paypalHttpClient.request(argument)

    expect(mockedAxios.request).toHaveBeenCalledTimes(3)

    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        method: "POST",
        url: argument.url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer undefined`,
        },
      })
    )

    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "POST",
        url: PaypalApiPath.AUTH,
        auth: { password: options.clientId, username: options.clientSecret },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type: "client_credentials",
        },
      })
    )

    expect(mockedAxios.request).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: "POST",
        url: argument.url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
      false
    )
  })
})
