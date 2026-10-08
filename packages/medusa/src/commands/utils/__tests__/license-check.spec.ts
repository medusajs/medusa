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
  claims: { sub: "org_test", features: ["rbac"] },
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
      status: "invalid",
      claims: null,
      token: null,
    })

    await run()

    expect(checkLicenseRemoteMock).not.toHaveBeenCalled()
  })

  it("sends the configured license key", async () => {
    mockResponse({ status: "active" })

    await run()

    expect(checkLicenseRemoteMock).toHaveBeenCalledWith("token")
  })

  it("fails open when Cloud is unreachable", async () => {
    mockResponse(null)

    const task = run()
    await task

    expect(task.logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })

  it("stays silent on an active license", async () => {
    mockResponse({ status: "active" })

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

  it("exits on a revoked license", async () => {
    mockResponse({ status: "revoked" })

    const task = run()
    await task

    expect(task.logger.error).toHaveBeenCalledWith(
      expect.stringContaining("no longer entitles this instance")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("never rejects, even when the check itself throws", async () => {
    checkLicenseRemoteMock.mockRejectedValue(new Error("boom"))

    const task = run()

    await expect(task).resolves.toBeUndefined()
    expect(exit).not.toHaveBeenCalled()
  })
})
