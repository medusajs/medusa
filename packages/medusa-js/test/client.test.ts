import { enableFetchMocks } from "jest-fetch-mock"
enableFetchMocks()
import Medusa, { ResponsePromise, Config, BaseResource } from "../src/index"
beforeEach(async () => {
  fetchMock.doMock()
})
describe("Medusa Client", () => {
  test("Can access clienton medusa instance", () => {
    const config = {
      apiKey: "234",
      baseUrl: "http://example.com",
      maxRetries: 1,
    }
    const medusa = new Medusa(config)
    expect(medusa.client).toBeDefined()
  })
  test.skip("Can set extra auth urls", async () => {
    fetchMock.mockResponseOnce("ok", { status: 200, statusText: "ok" })

    const config = {
      apiKey: "234",
      baseUrl: "http://example.com",
      maxRetries: 1,
      extraAuthedEndpoints: ["/store-front/me"],
    }
    const medusa = new Medusa(config)
    const req = await medusa.client.request("GET", "/store-front/me")
    expect(fetchMock).toBeCalledWith({
      headers: expect.objectContaining({
        Authorization: `Bearer ${config.apiKey}`,
      }),
    })
  })
  test("can extend medusa-js with custom resources", async () => {
    const myMedusaClient = new MyMedusaClient({
      apiKey: "234",
      baseUrl: "http://example.com",
      maxRetries: 1,
    })
    expect(myMedusaClient).toHaveProperty("myCustomApiClient")
  })
  test.skip("can add auth header to custom resources", async () => {
    const config = {
      apiKey: "234",
      baseUrl: "http://example.com",
      maxRetries: 1,
      extraAuthedEndpoints: ["/store/my-custom-api"],
    }
    const myMedusaClient = new MyMedusaClient(config)
    expect(myMedusaClient).toHaveProperty("myCustomApiClient")
    expect(fetchMock).toBeCalledWith({
      headers: expect.objectContaining({
        Authorization: `Bearer ${config.apiKey}`,
      }),
    })
  })
})

export class MyCustomApiClient extends BaseResource {
  myCustomApi(
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<unknown> {
    const path = `/store/my-custom-api`
    return this.client.request("GET", path, undefined, {}, customHeaders)
  }
}
class MyMedusaClient extends Medusa {
  myCustomApiClient: MyCustomApiClient

  constructor(config: Config) {
    super(config)
    this.myCustomApiClient = new MyCustomApiClient(this.client)
  }
}
