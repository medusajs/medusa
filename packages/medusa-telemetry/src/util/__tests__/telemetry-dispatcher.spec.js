import TelemetryDispatcher from "../telemetry-dispatcher"

jest.mock("../../store", () => jest.fn())

const httpError = (status) =>
  Object.assign(new Error(`Request failed with status ${status}`), {
    response: { status },
  })

const networkError = (code) => Object.assign(new Error(code), { code })

describe("TelemetryDispatcher.postWithRetry_", () => {
  let post
  let dispatcher

  beforeEach(() => {
    jest.spyOn(global, "setTimeout").mockImplementation((fn) => fn())
    post = jest.fn()
    dispatcher = new TelemetryDispatcher({ axiosInstance: { post } })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("retries a 503 response until it succeeds", async () => {
    post
      .mockRejectedValueOnce(httpError(503))
      .mockRejectedValueOnce(httpError(503))
      .mockResolvedValueOnce({ status: 200 })

    await expect(dispatcher.postWithRetry_("url", {}, {})).resolves.toEqual({
      status: 200,
    })
    expect(post).toHaveBeenCalledTimes(3)
  })

  it("retries a network error until it succeeds", async () => {
    post
      .mockRejectedValueOnce(networkError("ECONNRESET"))
      .mockResolvedValueOnce({ status: 200 })

    await expect(dispatcher.postWithRetry_("url", {}, {})).resolves.toEqual({
      status: 200,
    })
    expect(post).toHaveBeenCalledTimes(2)
  })

  it("stops after the maximum number of retries", async () => {
    const error = httpError(503)
    post.mockRejectedValue(error)

    await expect(dispatcher.postWithRetry_("url", {}, {})).rejects.toBe(error)
    expect(post).toHaveBeenCalledTimes(4)
  })

  it.each([
    ["a 400 response", httpError(400)],
    ["an unresolvable host", networkError("ENOTFOUND")],
    ["an expired certificate", networkError("CERT_HAS_EXPIRED")],
    ["a timeout", networkError("ECONNABORTED")],
  ])("doesn't retry %s", async (_, error) => {
    post.mockRejectedValue(error)

    await expect(dispatcher.postWithRetry_("url", {}, {})).rejects.toBe(error)
    expect(post).toHaveBeenCalledTimes(1)
  })
})
