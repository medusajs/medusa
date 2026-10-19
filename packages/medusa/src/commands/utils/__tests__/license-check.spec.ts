import { asValue } from "@medusajs/framework/awilix"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  License,
} from "@medusajs/framework/utils"
import { LICENSE_CHECK_URL, startLicenseRemoteCheck } from "../license-check"

const license: License = {
  token: "token",
  sub: "org_test",
  features: ["rbac"],
}

const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

const originalFetch = global.fetch
const fetchMock = jest.fn()

function run(registeredLicense?: License | null): Promise<void> {
  const container = createMedusaContainer()
  container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))

  if (registeredLicense !== undefined) {
    container.register(
      ContainerRegistrationKeys.LICENSE,
      asValue(registeredLicense)
    )
  }

  return startLicenseRemoteCheck(container)
}

function mockResponse(status: number, body: unknown): void {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
}

function expectFailOpen(): void {
  expect(logger.warn).toHaveBeenCalledWith(
    expect.stringContaining("Could not verify the configured license key")
  )
  expect(logger.error).not.toHaveBeenCalled()
  expect(exit).not.toHaveBeenCalled()
}

let exit: jest.SpyInstance

beforeEach(() => {
  global.fetch = fetchMock
  exit = jest
    .spyOn(process, "exit")
    .mockImplementation((() => undefined) as never)
})

afterEach(() => {
  global.fetch = originalFetch
  jest.resetAllMocks()
  jest.restoreAllMocks()
})

describe("startLicenseRemoteCheck", () => {
  it("skips the check when no license is registered", async () => {
    await run()
    await run(null)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("posts the configured license key to Medusa Cloud", async () => {
    mockResponse(200, { status: "active" })

    await run(license)

    expect(fetchMock).toHaveBeenCalledWith(
      LICENSE_CHECK_URL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ license_key: "token" }),
      })
    )
  })

  it("stays silent on an active license", async () => {
    mockResponse(200, { status: "active" })

    await run(license)

    expect(logger.warn).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })

  it("exits on a key Cloud does not recognize", async () => {
    mockResponse(200, { status: "invalid" })

    await run(license)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("was not issued by Medusa")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("exits on a revoked license", async () => {
    mockResponse(200, { status: "revoked" })

    await run(license)

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("no longer entitles this instance")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("warns and carries on on a non-2xx response", async () => {
    mockResponse(500, { status: "revoked" })

    await run(license)

    expectFailOpen()
  })

  it("warns and carries on on a network error", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"))

    await expect(run(license)).resolves.toBeUndefined()

    expectFailOpen()
  })

  it("warns and carries on when the request times out", async () => {
    // The rejection AbortSignal.timeout() produces, without the real wait.
    fetchMock.mockRejectedValue(
      new DOMException(
        "The operation was aborted due to timeout",
        "TimeoutError"
      )
    )

    await run(license)

    expectFailOpen()
  })

  it("warns and carries on on an unparsable body", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Unexpected token")
      },
    })

    await run(license)

    expectFailOpen()
  })

  it.each([
    { status: "expired" },
    { status: 1 },
    { status: "toString" },
    {},
    null,
  ])("warns and carries on on an unknown status: %j", async (body) => {
    mockResponse(200, body)

    await run(license)

    expectFailOpen()
  })
})
