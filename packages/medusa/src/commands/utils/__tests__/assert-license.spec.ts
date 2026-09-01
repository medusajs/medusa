import { ConfigModule, Logger } from "@medusajs/framework/types"
import {
  LicenseKeyEnvVars,
  Modules,
  resetLicenseState,
} from "@medusajs/framework/utils"
import { generateKeyPairSync, sign } from "crypto"
import {
  assertConfiguredLicenses,
  getConfiguredLicensedFeatures,
} from "../assert-license"

function toSegment(value: object): string {
  return Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")
}

function setLicenseEnv(features: string[]): void {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519")

  const headerSegment = toSegment({ alg: "EdDSA", kid: "test-key" })
  const payloadSegment = toSegment({
    sub: "org_test",
    jti: "lic_test",
    features,
    iat: Math.floor(Date.now() / 1000),
  })
  const signature = sign(
    null,
    Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
    privateKey
  ).toString("base64url")

  process.env[
    LicenseKeyEnvVars.KEY
  ] = `${headerSegment}.${payloadSegment}.${signature}`
  process.env[LicenseKeyEnvVars.PUBLIC_KEY] = publicKey
    .export({ type: "spki", format: "pem" })
    .toString()

  resetLicenseState()
}

const oidcProvider = { resolve: "@medusajs/auth-oidc", id: "oidc" }
const emailpassProvider = {
  resolve: "@medusajs/medusa/auth-emailpass",
  id: "emailpass",
}

function authModuleWith(providers: object[]): object {
  return { resolve: "@medusajs/medusa/auth", options: { providers } }
}

afterEach(() => {
  delete process.env[LicenseKeyEnvVars.KEY]
  delete process.env[LicenseKeyEnvVars.PUBLIC_KEY]

  resetLicenseState()
  jest.restoreAllMocks()
})

describe("getConfiguredLicensedFeatures", () => {
  it("finds nothing in an empty configuration", () => {
    expect(getConfiguredLicensedFeatures(undefined)).toEqual([])
    expect(getConfiguredLicensedFeatures({})).toEqual([])
  })

  it("finds rbac when its module is enabled", () => {
    expect(
      getConfiguredLicensedFeatures({
        [Modules.RBAC]: { resolve: "@medusajs/medusa/rbac" },
      })
    ).toEqual(["rbac"])
  })

  it("ignores rbac when its module is disabled", () => {
    expect(
      getConfiguredLicensedFeatures({
        [Modules.RBAC]: { resolve: "@medusajs/medusa/rbac", disable: true },
      } as ConfigModule["modules"])
    ).toEqual([])

    expect(getConfiguredLicensedFeatures({ [Modules.RBAC]: false })).toEqual([])
  })

  it("finds auth-oidc when the auth module registers the provider", () => {
    expect(
      getConfiguredLicensedFeatures({
        [Modules.AUTH]: authModuleWith([emailpassProvider, oidcProvider]),
      })
    ).toEqual(["auth-oidc"])
  })

  it("ignores auth modules without the oidc provider", () => {
    expect(
      getConfiguredLicensedFeatures({
        [Modules.AUTH]: authModuleWith([emailpassProvider]),
      })
    ).toEqual([])

    expect(
      getConfiguredLicensedFeatures({
        [Modules.AUTH]: { resolve: "@medusajs/medusa/auth" },
      })
    ).toEqual([])
  })

  it("finds both features when both are configured", () => {
    expect(
      getConfiguredLicensedFeatures({
        [Modules.RBAC]: { resolve: "@medusajs/medusa/rbac" },
        [Modules.AUTH]: authModuleWith([oidcProvider]),
      })
    ).toEqual(["rbac", "auth-oidc"])
  })
})

describe("assertConfiguredLicenses", () => {
  function run(modules: object): {
    logger: { error: jest.Mock }
    exit: jest.SpyInstance
  } {
    const logger = { error: jest.fn() }
    const exit = jest
      .spyOn(process, "exit")
      .mockImplementation((() => undefined) as never)

    assertConfiguredLicenses(
      { modules } as unknown as ConfigModule,
      logger as unknown as Logger
    )

    return { logger, exit }
  }

  it("does nothing when no license gated feature is configured", () => {
    const { logger, exit } = run({
      [Modules.AUTH]: authModuleWith([emailpassProvider]),
    })

    expect(logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })

  it("fails the build when a configured feature has no license", () => {
    const { logger, exit } = run({
      [Modules.RBAC]: { resolve: "@medusajs/medusa/rbac" },
    })

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("requires a Medusa license key")
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("fails the build when the license does not cover a configured feature", () => {
    setLicenseEnv(["rbac"])

    const { logger, exit } = run({
      [Modules.AUTH]: authModuleWith([oidcProvider]),
    })

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('does not cover the "auth-oidc" feature')
    )
    expect(exit).toHaveBeenCalledWith(1)
  })

  it("passes when the license covers every configured feature", () => {
    setLicenseEnv(["rbac", "auth-oidc"])

    const { logger, exit } = run({
      [Modules.RBAC]: { resolve: "@medusajs/medusa/rbac" },
      [Modules.AUTH]: authModuleWith([oidcProvider]),
    })

    expect(logger.error).not.toHaveBeenCalled()
    expect(exit).not.toHaveBeenCalled()
  })
})
