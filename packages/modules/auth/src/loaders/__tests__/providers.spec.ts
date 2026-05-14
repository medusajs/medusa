import { asValue } from "@medusajs/deps/awilix"
import { createMedusaContainer } from "@medusajs/utils"
import loadProviders from "../providers"
import AuthMfaProviderService from "../../services/mfa-provider"

class MfaProviderWithoutIdentifier {
  readonly method = "missing_identifier"
}

describe("providers loader - MFA", () => {
  let container
  const logger = {
    error: jest.fn(),
  }

  beforeEach(() => {
    container = createMedusaContainer()
    container.register({
      logger: asValue(logger),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("rejects MFA providers without a static identifier", async () => {
    const err = await loadProviders({
      container,
      options: {
        mfa: {
          providers: [
            {
              resolve: {
                services: [MfaProviderWithoutIdentifier],
              },
              id: "missing_identifier",
            },
          ],
        },
      },
    } as any).catch((e) => e)

    expect(err).toBeTruthy()
    expect(err.message).toBe(
      "Trying to register an MFA provider without a provider identifier."
    )
  })

  it("returns a helpful error when an MFA method id is unknown", async () => {
    await loadProviders({
      container,
      options: {},
    } as any)

    const service = new AuthMfaProviderService((container as any).cradle)

    await expect(
      service.start("unknown", {
        auth_identity_id: "auth-id",
        provider: "unknown",
      })
    ).rejects.toThrow("Unable to retrieve the MFA method with id: unknown")

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("AwilixResolutionError"),
      expect.any(Error)
    )
  })
})
