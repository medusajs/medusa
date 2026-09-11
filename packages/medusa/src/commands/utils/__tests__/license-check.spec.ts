import { Logger } from "@medusajs/framework/types"
import {
  checkLicenseRemote,
  LicenseCheckResponse,
  loadLicense,
  MEDUSA_CLOUD_EXECUTION_CONTEXT,
  registerLicensedFeature,
  resetLicenseState,
} from "@medusajs/framework/utils"
import { startLicenseRemoteCheck } from "../license-check"

jest.mock("@medusajs/framework/utils", () => ({
  ...jest.requireActual("@medusajs/framework/utils"),
  checkLicenseRemote: jest.fn(),
  loadLicense: jest.fn(),
}))

const checkLicenseRemoteMock = checkLicenseRemote as jest.Mock
const loadLicenseMock = loadLicense as jest.Mock

const validLicense = {
  status: "valid",
  token: "token",
  claims: { sub: "org_test", jti: "lic_test", features: ["rbac"], iat: 1 },
}

function run(): Promise<void> & {
  logger: {
    debug: jest.Mock
    info: jest.Mock
    warn: jest.Mock
    error: jest.Mock
  }
} {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  return Object.assign(startLicenseRemoteCheck(logger as unknown as Logger), {
    logger,
  })
}

let exit: jest.SpyInstance

beforeEach(() => {
  registerLicensedFeature("rbac")
  loadLicenseMock.mockReturnValue(validLicense)
  exit = jest
    .spyOn(process, "exit")
    .mockImplementation((() => undefined) as never)
})

afterEach(() => {
  delete process.env.EXECUTION_CONTEXT

  resetLicenseState()
  jest.resetAllMocks()
  jest.restoreAllMocks()
})

function mockResponse(response: LicenseCheckResponse | null): void {
  checkLicenseRemoteMock.mockResolvedValue(response)
}

describe("startLicenseRemoteCheck", () => {
  it("skips the check on Medusa Cloud hosted instances", async () => {
    process.env.EXECUTION_CONTEXT = MEDUSA_CLOUD_EXECUTION_CONTEXT

    await run()

    expect(checkLicenseRemoteMock).not.toHaveBeenCalled()
  })

  it("skips the check when no license gated package was loaded", async () => {
    resetLicenseState()

    await run()

    expect(checkLicenseRemoteMock).not.toHaveBeenCalled()
  })

  it("skips the check when the local license is not valid", async () => {
    loadLicenseMock.mockReturnValue({
      status: "none",
      claims: null,
      token: null,
    })

    await run()

    expect(checkLicenseRemoteMock).not.toHaveBeenCalled()
  })

  it("fails open when Cloud is unreachable", async () => {
    mockResponse(null)

    const task = run()
    await task

    expect(task.logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })

  it("stays silent on an active license", async () => {
    mockResponse({ status: "active", expires_at: "2027-01-01T00:00:00.000Z" })

    const task = run()
    await task

    expect(task.logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })

  it("exits on a key Cloud does not recognize", async () => {
    mockResponse({ status: "invalid" })

    const task = run()
    await task

    expect(task.logger.error).toHaveBeenCalledWith(
      expect.stringContaining("was not issued by Medusa")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("warns without exiting on an expired license within its grace window", async () => {
    const graceUntil = new Date(Date.now() + 24 * 60 * 60 * 1000)
    mockResponse({
      status: "expired",
      expires_at: "2026-01-01T00:00:00.000Z",
      grace_until: graceUntil.toISOString(),
    })

    const task = run()
    await task

    expect(task.logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(graceUntil.toISOString())
    )
    expect(exit).not.toHaveBeenCalled()
  })

  it("exits on an expired license past its grace window", async () => {
    mockResponse({
      status: "expired",
      expires_at: "2026-01-01T00:00:00.000Z",
      grace_until: "2026-01-08T00:00:00.000Z",
    })

    const task = run()
    await task

    expect(task.logger.error).toHaveBeenCalledWith(
      expect.stringContaining("grace window has passed")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("exits on a revoked license without a grace window", async () => {
    mockResponse({ status: "revoked" })

    const task = run()
    await task

    expect(exit).toHaveBeenCalledWith(1)
  })

  it("never rejects, even when the check itself throws", async () => {
    checkLicenseRemoteMock.mockRejectedValue(new Error("boom"))

    const task = run()

    await expect(task).resolves.toBeUndefined()
    expect(exit).not.toHaveBeenCalled()
  })
})
